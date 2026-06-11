const AUTH_URL = "https://functions.poehali.dev/edf73421-b68d-45e4-b213-33d088c52f8c";

export type User = {
  id: number;
  username: string;
  displayName: string;
  role: "admin" | "member";
  avatar: string;
  bio: string;
  city: string;
  age: number | null;
};

function getToken() {
  return localStorage.getItem("fc_session") || "";
}

async function call(method: string, action: string, body?: object) {
  const isGet = method === "GET";
  const url = isGet ? `${AUTH_URL}?action=${action}` : AUTH_URL;
  const token = getToken();

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-Session-Id": token } : {}),
    },
    ...(isGet ? {} : { body: JSON.stringify({ action, ...body }) }),
  });

  const text = await res.text();
  let data: unknown;
  try {
    const parsed = JSON.parse(text);
    data = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
  } catch {
    data = {};
  }
  return { status: res.status, data: data as Record<string, unknown> };
}

export async function login(username: string, password: string) {
  const { status, data } = await call("POST", "login", { username, password });
  if (status !== 200) throw new Error((data?.error as string) || "Ошибка входа");
  localStorage.setItem("fc_session", data.token as string);
  return data.user as User;
}

export async function getMe(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;
  const { status, data } = await call("GET", "me");
  if (status !== 200) {
    localStorage.removeItem("fc_session");
    return null;
  }
  return data.user as User;
}

export async function logout() {
  await call("POST", "logout");
  localStorage.removeItem("fc_session");
}

export async function listUsers(): Promise<User[]> {
  const { status, data } = await call("GET", "list_users");
  if (status !== 200) throw new Error((data?.error as string) || "Нет доступа");
  return data.users as User[];
}

export async function createUser(user: {
  username: string;
  displayName: string;
  password: string;
  role: string;
  avatar: string;
  city: string;
  age: number | null;
  bio: string;
}) {
  const { status, data } = await call("POST", "create_user", user);
  if (status !== 200) throw new Error((data?.error as string) || "Ошибка создания");
  return data;
}

export async function deleteUser(userId: number) {
  const { status, data } = await call("POST", "delete_user", { userId });
  if (status !== 200) throw new Error((data?.error as string) || "Ошибка удаления");
  return data;
}
