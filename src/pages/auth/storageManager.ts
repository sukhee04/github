export class StorageManager {
  // 내부 로직: 포맷 변환용
  private static wrap(value: any, ttlMs?: number) {
    const now = Date.now();

    return {
      value,
      expiry: ttlMs ? now + ttlMs : null, // TTL 없으면 null
    };
  }

  private static unwrap(itemStr: string | null) {
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);

      // TTL 없는 경우 그대로 반환
      if (!item.expiry) return item.value;

      // TTL 존재 → 만료 검사
      if (Date.now() > item.expiry) {
        return "expired";
      }

      return item.value;
    } catch (e) {
      return null;
    }
  }

  // 1) 저장
  // value: 어떤 타입이든 가능
  // ttlMs: TTL 밀리초 단위 (옵션)
  static save(key: string, value: any, ttlMs?: number) {
    const wrapped = this.wrap(value, ttlMs);
    localStorage.setItem(key, JSON.stringify(wrapped));
  }

  // 2) 조회
  static get(key: string) {
    const itemStr = localStorage.getItem(key);
    const result = this.unwrap(itemStr);

    if (result === "expired") {
      localStorage.removeItem(key);
      return null;
    }

    return result;
  }

  // 3) 수정
  // 기존 값을 기반으로 업데이트
  // 부분 업데이트도 가능하게 만드는 방식
  static update(key: string, newValue: any) {
    const current = this.get(key);
    if (current === null) return false;

    // 객체 수정 지원
    const updated =
      typeof current === "object"
        ? { ...current, ...newValue }
        : newValue;

    // TTL 유지해야 하므로 기존 wrapped 정보 확인
    const itemStr = localStorage.getItem(key);
    const itemRaw = itemStr ? JSON.parse(itemStr) : null;

    const ttlRemaining =
      itemRaw && itemRaw.expiry ? itemRaw.expiry - Date.now() : null;

    this.save(key, updated, ttlRemaining ?? undefined);

    return true;
  }

  // 4) 삭제
  static delete(key: string) {
    localStorage.removeItem(key);
  }

  // 5) 전체 삭제 (clear)
  static clear() {
    localStorage.clear();
  }
}
