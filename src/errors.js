// 사용자 관련 에러
export class DuplicateUserEmailError extends Error {
  errorCode = "U001";
  
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DuplicateUserNicknameError extends Error {
  errorCode = "U002";
  
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 지역/가게 관련 에러
export class RegionNotFoundError extends Error {
  errorCode = "R001";
  
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class StoreNotFoundError extends Error {
  errorCode = "S001";
  
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 미션 관련 에러
export class MissionNotFoundError extends Error {
  errorCode = "M001";
  
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class MissionAlreadyChallengingError extends Error {
  errorCode = "M002";
  
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}