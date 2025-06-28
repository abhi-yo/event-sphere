const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n🔒 SECURE ADMIN USER CREATOR");
console.log("=============================\n");

console.log("⚠️  SECURITY REQUIREMENTS:");
console.log("• Password must be at least 12 characters");
console.log("• Must contain uppercase and lowercase letters");
console.log("• Must contain at least 2 numbers");
console.log("• Must contain at least 2 special characters");
console.log("• Cannot contain common patterns\n");

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function hiddenQuestion(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    let password = "";

    process.stdin.on("data", function (char) {
      char = char + "";

      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write("\n");
          resolve(password);
          break;
        case "\u0003":
          process.exit();
          break;
        case "\u007f":
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write("\b \b");
          }
          break;
        default:
          password += char;
          process.stdout.write("*");
          break;
      }
    });
  });
}

async function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function validatePassword(password) {
  const requirements = {
    minLength: password.length >= 12,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: (password.match(/\d/g) || []).length >= 2,
    hasSpecialChars:
      (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >=
      2,
    noCommonPatterns: !["password", "123456", "admin", "letmein"].some(
      (common) => password.toLowerCase().includes(common.toLowerCase())
    ),
    noRepetition: !/(.)\1{2,}/.test(password),
  };

  const errors = [];
  if (!requirements.minLength) errors.push("Must be at least 12 characters");
  if (!requirements.hasUppercase) errors.push("Must contain uppercase letters");
  if (!requirements.hasLowercase) errors.push("Must contain lowercase letters");
  if (!requirements.hasNumbers) errors.push("Must contain at least 2 numbers");
  if (!requirements.hasSpecialChars)
    errors.push("Must contain at least 2 special characters");
  if (!requirements.noCommonPatterns)
    errors.push("Cannot contain common patterns");
  if (!requirements.noRepetition)
    errors.push("Cannot have 3+ consecutive identical characters");

  return { isValid: errors.length === 0, errors };
}

async function createAdmin() {
  try {
    console.log("📧 ADMIN EMAIL SETUP");
    console.log("--------------------");

    let email;
    while (true) {
      email = await question("Enter admin email: ");
      if (await validateEmail(email)) {
        break;
      }
      console.log("❌ Invalid email format. Please try again.\n");
    }

    console.log("\n🔑 PASSWORD SETUP");
    console.log("-----------------");

    const generateOption = await question(
      "Generate secure password automatically? (y/N): "
    );

    let adminSecret;
    while (true) {
      adminSecret = await hiddenQuestion("Enter your ADMIN_SECRET: ");
      if (adminSecret.trim().length > 0) {
        break;
      }
      console.log("❌ ADMIN_SECRET is required\n");
    }

    let requestBody;

    if (
      generateOption.toLowerCase() === "y" ||
      generateOption.toLowerCase() === "yes"
    ) {
      requestBody = {
        email: email.toLowerCase(),
        adminSecret,
        generatePassword: true,
        adminLevel: "admin",
      };

      console.log("\n✅ Will generate secure password automatically");
    } else {
      let password;
      while (true) {
        password = await hiddenQuestion("Enter admin password: ");
        const validation = await validatePassword(password);

        if (validation.isValid) {
          const confirmPassword = await hiddenQuestion("Confirm password: ");
          if (password === confirmPassword) {
            break;
          }
          console.log("❌ Passwords do not match. Please try again.\n");
        } else {
          console.log("❌ Password requirements not met:");
          validation.errors.forEach((error) => console.log(`   • ${error}`));
          console.log("");
        }
      }

      requestBody = {
        email: email.toLowerCase(),
        password,
        adminSecret,
        adminLevel: "admin",
      };
    }

    console.log("\n🚀 CREATING ADMIN USER...");
    console.log("========================");

    const response = await fetch(
      "http://localhost:3000/api/admin/create-admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log("\n✅ ADMIN USER CREATED SUCCESSFULLY!");
      console.log("==================================");
      console.log(`📧 Email: ${result.user.email}`);
      console.log(`🔐 Admin Level: ${result.user.adminLevel}`);
      console.log(
        `📅 Created: ${new Date(result.user.createdAt).toLocaleString()}`
      );

      if (result.generatedPassword) {
        console.log("\n🔑 GENERATED PASSWORD (SAVE THIS SECURELY):");
        console.log("===========================================");
        console.log(`Password: ${result.generatedPassword}`);
        console.log("\n⚠️  IMPORTANT: Save this password immediately!");
        console.log("   This is the only time it will be displayed.");
      }

      console.log("\n🔒 NEXT STEPS:");
      console.log("1. Use these credentials to access /admin-portal");
      console.log("2. First enter your ADMIN_SECRET code");
      console.log("3. Then login with the email and password\n");
    } else {
      console.log("\n❌ FAILED TO CREATE ADMIN USER");
      console.log("==============================");
      console.log(`Error: ${result.error}`);
      if (result.details) {
        console.log("Details:");
        result.details.forEach((detail) => console.log(`  • ${detail}`));
      }
    }
  } catch (error) {
    console.log("\n💥 ERROR OCCURRED");
    console.log("================");
    console.log("Make sure your Next.js server is running on port 3000");
    console.log(`Error: ${error.message}`);
  }

  rl.close();
}

if (require.main === module) {
  createAdmin();
}
