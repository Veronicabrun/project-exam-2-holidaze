import {
  isValidEmail,
  isStudNoroffEmail,
  isValidPassword,
  isValidName,
} from "./validation";

describe("validation utils", () => {
  test("accepts a valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  test("rejects an invalid email", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  test("accepts a stud.noroff.no email", () => {
    expect(isStudNoroffEmail("student@stud.noroff.no")).toBe(true);
  });

  test("rejects a non-stud.noroff.no email", () => {
    expect(isStudNoroffEmail("student@gmail.com")).toBe(false);
  });

  test("accepts password with 8 or more characters", () => {
    expect(isValidPassword("password123")).toBe(true);
  });

  test("rejects password shorter than 8 characters", () => {
    expect(isValidPassword("short")).toBe(false);
  });

  test("accepts a name with at least 3 characters", () => {
    expect(isValidName("Veronica")).toBe(true);
  });

  test("rejects a name shorter than 3 characters", () => {
    expect(isValidName("Al")).toBe(false);
  });
});