const { determineRole } = require('./helpers');
const  { RoleType } = require("../context");
const { validateForm } = require("./helpers");
const  { hasChanged, capitalizeFirstLetter } = require("./helpers");
const { getCurrentEvent } = require("./helpers");
const { useQuery } = require("@apollo/client");

describe("determineRole", () => {
  it("should return RoleType.USER when role is 'User'", () => {
    expect(determineRole("User")).toBe(RoleType.USER);
  });

  it("should return RoleType.Admin when role is 'Admin'", () => {
    expect(determineRole("Admin")).toBe(RoleType.Admin);
  });

  it("should return RoleType.SuperAdmin when role is 'SuperAdmin'", () => {
    expect(determineRole("SuperAdmin")).toBe(RoleType.SuperAdmin);
  });

  it("should return null when role is null", () => {
    expect(determineRole(null)).toBe(null);
  });

  it("should return null when role is not recognized", () => {
    expect(determineRole("UnknownRole")).toBe(null);
  });
});


describe("validateForm", () => {
    it("should return true for valid userName", () => {
      expect(validateForm("userName", "John Doe")).toBe(true);
    });
  
    it("should return false for invalid userName", () => {
      expect(validateForm("userName", "John123")).toBe(false);
    });
  
    it("should return true for valid lastName", () => {
      expect(validateForm("lastName", "Doe")).toBe(true);
    });
  
    it("should return false for invalid lastName", () => {
      expect(validateForm("lastName", "Doe123")).toBe(false);
    });
  
    it("should return true for valid email", () => {
      expect(validateForm("email", "test@example.com")).toBe(true);
    });
  
    it("should return false for invalid email", () => {
      expect(validateForm("email", "test@example")).toBe(false);
    });
  
    it("should return true for valid password", () => {
      expect(validateForm("password", "password123")).toBe(true);
    });
  
    it("should return false for invalid password", () => {
      expect(validateForm("password", "passwd")).toBe(false);
    });
  
    it("should return false for unsupported type", () => {
      expect(validateForm("unsupported", "value")).toBe(false);
    });
  });


describe("hasChanged", () => {
  it("should return false for equal objects", () => {
    const obj1 = { name: "John Doe", age: 30 };
    const obj2 = { name: "John Doe", age: 30 };
    expect(hasChanged(obj1, obj2)).toBe(false);
  });

  it("should return true for different objects", () => {
    const obj1 = { name: "John Doe", age: 30 };
    const obj2 = { name: "Jane Doe", age: 25 };
    expect(hasChanged(obj1, obj2)).toBe(true);
  });
});

describe("capitalizeFirstLetter", () => {
  it("should capitalize first letter of a string", () => {
    expect(capitalizeFirstLetter("john doe")).toBe("John doe");
  });

  it("should return empty string for empty input", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });

  it("should return input string if it's not a string", () => {
    expect(capitalizeFirstLetter(123)).toBe(123);
  });
});


