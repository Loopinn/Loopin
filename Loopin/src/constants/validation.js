// 유효성 검사
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

export const idRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,12}$/;
