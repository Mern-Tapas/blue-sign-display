/** Result every auth handler resolves with. Forms render `error` in an alert and `fieldErrors` under fields. */
export type AuthResult<Field extends string = string> =
  | { ok: true }
  | { ok: false; error?: string; fieldErrors?: Partial<Record<Field, string>> };

export type AuthHandler<Values, Field extends string = string> = (values: Values) => Promise<AuthResult<Field>>;

export type SocialProvider = "google" | "apple";
