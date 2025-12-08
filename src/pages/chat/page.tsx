// src/pages/chat/page.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import {  auth, db, storage } from "../../repository/firebaseConfig";
import type { User } from "firebase/auth";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type ChatRoom = {
  id: string;
  type: "private" | "group";
  title: string;
  members: string[];
  roomKey?: string | null;
  lastMessage?: string;
  lastMessageAt?: Timestamp | null;
  lastSenderId?: string;
  createdAt?: Timestamp | null;
  readByMap?: Record<string, Timestamp>;
};


type Message = {
  id: string;
  senderId: string;
  text?: string;
  createdAt?: Timestamp | null;
  readBy?: string[];
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  replyToId?: string;
  replyPreviewText?: string;
};

export default function Chat() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userNameMap, setUserNameMap] = useState<Record<string, string>>({});

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const [chatList, setChatList] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // 🔵 reply хийх гэж байгаа мессеж
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);

  // 🔵 group info bottom sheet
  const [showInfo, setShowInfo] = useState(false);

  // 🔵 image/file upload progress
  const [uploading, setUploading] = useState(false);

  const location = useLocation();

  const selectedChat = useMemo(
    () => chatList.find((c) => c.id === selectedChatId),
    [chatList, selectedChatId]
  );

  useEffect(() => {
    if (messages.length === 0) return;

    const needFetch = Array.from(
      new Set(
        messages
          .map((m) => m.senderId)
          .filter((uid) => uid && !userNameMap[uid])
      )
    );

    if (needFetch.length === 0) return;

    (async () => {
      const updates: Record<string, string> = {};

      for (const uid of needFetch) {
        try {
          const userRef = doc(db, "users", uid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            const data = snap.data();
            updates[uid] =
              data.displayName ||
              data.nickname ||
              data.name ||
              uid; // fallback
          } else {
            updates[uid] = uid;
          }
        } catch {
          updates[uid] = uid;
        }
      }

      setUserNameMap((prev) => ({ ...prev, ...updates }));
    })();
  }, [messages]);


  // =========================
  // 0. Auth state
  // =========================
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  // Matching-оос navigate("/chat", { state: { chatId } }) ирвэл
  useEffect(() => {
    const state = location.state as { chatId?: string } | null;
    if (state?.chatId) {
      setSelectedChatId(state.chatId);
    }
  }, [location.state]);

  // =========================
  // 1. Chat list realtime (central "chats" collection)
  // =========================
  useEffect(() => {
    if (!currentUser) return;

    const qChats = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid),
    );

    const unsub = onSnapshot(qChats, (snap) => {
      const rooms: ChatRoom[] = snap.docs.map((d) => {
        const data = d.data() as Omit<ChatRoom, "id">;
        return { id: d.id, ...data };
      });

      // 🔵 roomKey 기준으로 중복 제거 (없으면 id 기준)
// src/pages/chat/page.tsx - 현재 코드 (줄 58~67)
// 🔵 roomKey 기준으로 중복 제거 (없으면 id 기준)
      const dedupe: Record<string, ChatRoom> = {};

      rooms.forEach((room) => {
        const key = room.roomKey || room.id; // <-- 문제의 원인
        const exist = dedupe[key];
        // ... 중략 ...
        if (!exist) dedupe[key] = room;
        else {
          const prev = exist.lastMessageAt?.seconds || 0;
          const cur = room.lastMessageAt?.seconds || 0;
          if (cur > prev) dedupe[key] = room;
        }
      });

      setChatList(Object.values(dedupe));
    });

    return () => unsub();
  }, [currentUser]);


  // =========================
  // 2. Messages realtime + read receipt
  // =========================
  useEffect(() => {
    if (!currentUser || !selectedChatId) return;

    const msgCol = collection(db, "chats", selectedChatId, "messages");
    const qMsg = query(msgCol, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(qMsg, async (snap) => {
      const msgs: Message[] = snap.docs.map((d) => {
        const data = d.data() as Omit<Message, "id">;
        return { id: d.id, ...data };
      });
      setMessages(msgs);

      // 🔵 message бүр дээр readBy array-д өөрийн uid-г нэмэх
      const batchPromises: Promise<any>[] = [];
      snap.docs.forEach((docSnap) => {
        const data = docSnap.data() as Message;
        const readBy = data.readBy || [];
        if (!readBy.includes(currentUser.uid)) {
          const mRef = doc(
            db,
            "chats",
            selectedChatId,
            "messages",
            docSnap.id
          );
          batchPromises.push(
            updateDoc(mRef, {
              readBy: arrayUnion(currentUser.uid),
            })
          );
        }
      });
      if (batchPromises.length > 0) {
        await Promise.all(batchPromises);
      }

      // 🔵 chat level readByMap
      const chatRef = doc(db, "chats", selectedChatId);
      await updateDoc(chatRef, {
        [`readByMap.${currentUser.uid}`]: serverTimestamp(),
      });
    });

    return () => unsub();
  }, [currentUser, selectedChatId]);

  // =========================
  // 3. Send message (text / image / file + reply)
  // =========================
  const sendMessage = async (payload: {
    text?: string;
    imageFile?: File;
    otherFile?: File;
  }) => {
    if (!currentUser || !selectedChatId) return;

    const { text, imageFile, otherFile } = payload;

    if (!text && !imageFile && !otherFile) return;

    try {
      setUploading(!!imageFile || !!otherFile);

      let imageUrl: string | undefined;
      let fileUrl: string | undefined;
      let fileName: string | undefined;

      // 🔵 image upload
      if (imageFile) {
        const fileRef = ref(
          storage,
          `chatFiles/${selectedChatId}/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(fileRef, imageFile);
        imageUrl = await getDownloadURL(fileRef);
      }

      // 🔵 other file upload
      if (otherFile) {
        const fileRef = ref(
          storage,
          `chatFiles/${selectedChatId}/${Date.now()}_${otherFile.name}`
        );
        await uploadBytes(fileRef, otherFile);
        fileUrl = await getDownloadURL(fileRef);
        fileName = otherFile.name;
      }

      const msgCol = collection(db, "chats", selectedChatId, "messages");

      const msgData: any = {
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
        readBy: [currentUser.uid],
      };

      if (text) msgData.text = text;
      if (imageUrl) msgData.imageUrl = imageUrl;
      if (fileUrl) {
        msgData.fileUrl = fileUrl;
        msgData.fileName = fileName;
      }
      if (replyTarget) {
        msgData.replyToId = replyTarget.id;
        msgData.replyPreviewText =
          replyTarget.text ||
          replyTarget.imageUrl ||
          replyTarget.fileName ||
          "";
      }

      await addDoc(msgCol, msgData);

      // chat summary update
      const chatRef = doc(db, "chats", selectedChatId);
      await updateDoc(chatRef, {
        lastMessage:
          text ||
          (imageUrl ? "📷 사진을 보냈습니다." : "") ||
          (fileUrl ? `📎 파일: ${fileName}` : "") ||
          "새 메시지",
        lastMessageAt: serverTimestamp(),
        lastSenderId: currentUser.uid,
      });

      setNewMessage("");
      setReplyTarget(null);
    } catch (err) {
      console.error(err);
      alert("메시지 전송 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMessage.trim();
    await sendMessage({ text });
  };

  const handleSelectImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await sendMessage({ imageFile: file });
    e.target.value = "";
  };

  const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await sendMessage({ otherFile: file });
    e.target.value = "";
  };

  // =========================
  // time formatter
  // =========================
  const formatTime = (ts?: Timestamp | null) => {
    if (!ts) return "";
    const d = ts.toDate();
    const hh = d.getHours();
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ap = hh >= 12 ? "오후" : "오전";
    const h12 = hh % 12 || 12;
    return `${ap} ${h12}:${mm}`;
  };

  // 🔵 тухайн мессеж минийх үү
  const isMyMessage = (m: Message) =>
    currentUser && m.senderId === currentUser.uid;

  // 🔵 read receipt текст (миний илгээсэн мессеж дээр)
  const getReadReceiptText = (m: Message) => {
    if (!selectedChat || !isMyMessage(m)) return "";
    const memberCount = selectedChat.members.length;
    const readCount = m.readBy?.length || 0;

    if (readCount >= memberCount) return "모두 읽음";
    if (readCount <= 1) return "";
    return `${readCount - 1}명 읽음`;
  };

  // =========================
  // 1) Chat room screen
  // =========================
  if (selectedChatId && selectedChat) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 flex flex-col">
        {/* header */}
        <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedChatId(null)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-arrow-left-line text-gray-600 text-lg" />
              </button>

              <div
                className="flex items-center space-x-3"
                onClick={() =>
                  selectedChat.type === "group" && setShowInfo(true)
                }
              >
                {selectedChat.type === "group" ? (
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                    <i className="ri-group-line text-white text-lg" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white text-lg" />
                  </div>
                )}

                <div>
                  <h1 className="text-lg font-bold text-gray-800">
                    {selectedChat.title}
                  </h1>
                  {selectedChat.type === "group" && (
                    <p className="text-xs text-gray-500">
                      {selectedChat.members?.length ?? 0}명 참여중
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 flex items-center justify-center">
                <i className="ri-phone-line text-gray-600 text-lg" />
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center"
                onClick={() => setShowInfo(true)}
              >
                <i className="ri-more-line text-gray-600 text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* messages */}
        <div className="flex-1 pt-16 pb-20 px-4 py-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              아직 메시지가 없습니다.
            </div>
          )}

          <div className="space-y-4">
            {messages.map((m) => {
              const me = isMyMessage(m);
              const readText = getReadReceiptText(m);

              return (
                <div
                  key={m.id}
                  className={`flex ${me ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[80%]">
                    {/* reply preview дээр нь */}
                    {m.replyPreviewText && (
                      <div
                        className={`mb-1 px-3 py-2 rounded-xl text-xs ${
                          me
                            ? "bg-sky-100 text-sky-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span className="font-semibold mr-1">답장 대상:</span>
                        <span className="line-clamp-1">
                          {m.replyPreviewText}
                        </span>
                      </div>
                    )}

                    {/* sender (өөр хүн бол uid-ийн эхний хэсэг) */}
                    {!me && (
                      <p className="text-xs text-gray-500 mb-1 px-3">
                            {userNameMap[m.senderId] || (m.senderId.slice(0, 6) + "...")}
                      </p>
                    )}

                    <div
                      className={`px-4 py-3 rounded-2xl relative group ${
                        me
                          ? "bg-sky-500 text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                      }`}
                    >
                      {/* reply товч */}
                      <button
                        type="button"
                        onClick={() => setReplyTarget(m)}
                        className="absolute -top-3 right-2 hidden group-hover:block text-xs bg-black/40 text-white px-2 py-0.5 rounded-full"
                      >
                        답장
                      </button>

                      {/* text */}
                      {m.text && (
                        <p className="text-sm whitespace-pre-wrap mb-1">
                          {m.text}
                        </p>
                      )}

                      {/* image */}
                      {m.imageUrl && (
                        <img
                          src={m.imageUrl}
                          alt="이미지"
                          className="max-h-60 rounded-lg mt-1"
                        />
                      )}

                      {/* file */}
                      {m.fileUrl && (
                        <a
                          href={m.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center space-x-2 text-sm underline"
                        >
                          <i className="ri-attachment-line" />
                          <span>{m.fileName || "파일 다운로드"}</span>
                        </a>
                      )}
                    </div>

                    <div
                      className={`flex items-center mt-1 px-3 text-xs text-gray-400 ${
                        me ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="mr-1">
                        {formatTime(m.createdAt || null)}
                      </span>
                      {me && readText && (
                        <span className="text-[11px] text-sky-600">
                          {readText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* reply bar */}
        {replyTarget && (
          <div className="fixed bottom-16 left-0 right-0 px-4">
            <div className="bg-sky-100 rounded-xl px-3 py-2 flex items-center justify-between">
              <div className="text-xs text-sky-800">
                <p className="font-semibold mb-0.5">답장 중...</p>
                <p className="line-clamp-1">
                  {replyTarget.text ||
                    replyTarget.imageUrl ||
                    replyTarget.fileName ||
                    ""}
                </p>
              </div>
              <button
                onClick={() => setReplyTarget(null)}
                className="w-6 h-6 flex items-center justify-center text-sky-700"
              >
                <i className="ri-close-line" />
              </button>
            </div>
          </div>
        )}

        {/* input */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 space-y-2">
          {uploading && (
            <div className="text-center text-xs text-gray-500 mb-1">
              업로드 중입니다...
            </div>
          )}

          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-3"
          >
            {/* file buttons */}
            <div className="flex items-center space-x-1">
              <label className="w-8 h-8 flex items-center justify-center text-gray-400 cursor-pointer">
                <i className="ri-image-line text-lg" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSelectImage}
                />
              </label>

              <label className="w-8 h-8 flex items-center justify-center text-gray-400 cursor-pointer">
                <i className="ri-attachment-2 text-lg" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleSelectFile}
                />
              </label>
            </div>

            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white border-none text-sm"
                placeholder="메시지를 입력하세요..."
              />
            </div>

            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                newMessage.trim()
                  ? "bg-sky-500 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <i className="ri-send-plane-fill text-lg" />
            </button>
          </form>
        </div>

        {/* 🔵 Group info / members list bottom sheet */}
        {showInfo && (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-end"
            onClick={() => setShowInfo(false)}
          >
            <div
              className="bg-white w-full rounded-t-3xl p-4 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-2" />
              <h2 className="text-lg font-bold text-gray-800">
                채팅 정보
              </h2>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">제목: </span>
                  {selectedChat.title}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">참여자 수: </span>
                  {selectedChat.members.length}명
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  참여자 UID 목록
                </h3>
                <div className="space-y-1 max-h-40 overflow-auto">
                  {selectedChat.members.map((uid) => (
                    <div
                      key={uid}
                      className="px-3 py-2 bg-gray-50 rounded-xl text-xs text-gray-700"
                    >
                      {uid}
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="w-full mt-2 py-3 rounded-2xl bg-gray-100 text-gray-700 text-sm font-medium"
                onClick={() => setShowInfo(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================
  // 2) Chat list screen
  // =========================
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 pb-20">
      {/* top nav */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
              <i className="ri-message-line text-white text-lg" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">채팅</h1>
          </div>

          <button className="w-8 h-8 flex items-center justify-center">
            <i className="ri-search-line text-gray-600 text-lg" />
          </button>
        </div>
      </div>

      <div className="pt-16 pb-20 px-4 py-4">
        {chatList.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            아직 채팅이 없습니다.
          </div>
        )}

        <div className="space-y-2">
          {chatList.map((chat) => {
            const lastMsgTime = formatTime(chat.lastMessageAt);
            // unread badge: readByMap-д миний uid байхгүй & lastSenderId != currentUser.uid
            const unread =
              currentUser &&
              (!chat.readByMap?.[currentUser.uid] ||
                (chat.lastSenderId &&
                  chat.lastSenderId !== currentUser.uid));

            return (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center space-x-3">
                  {chat.type === "group" ? (
                    <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                      <i className="ri-group-line text-white text-lg" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-white text-lg" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-800 truncate">
                        {chat.title}
                      </h3>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {lastMsgTime}
                        </span>

                        {unread && (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              1
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage || "아직 메시지가 없습니다."}
                    </p>

                    {chat.type === "group" && (
                      <div className="flex items-center space-x-1 mt-2">
                        <i className="ri-group-line text-gray-400 text-xs" />
                        <span className="text-xs text-gray-500">
                          {chat.members?.length ?? 0}명
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}