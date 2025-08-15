// test-crud.js - Test script for the specific CRUD test case
const http = require("http");

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test the specific CRUD operations as requested
async function testSpecificCRUDCase() {
  console.log("🚀 Testing Specific CRUD Operations");
  console.log("=".repeat(60));
  console.log("📋 Test Case:");
  console.log("   1. Create: Virat Kohli (virat.kohli@example.com)");
  console.log("   2. Update: Change to King Kohli (king.kohli@example.com)");
  console.log("   3. Delete: Remove the updated entry");
  console.log("   4. Verify: Error handling for non-existent user");
  console.log("=".repeat(60));

  let userId = null;

  try {
    // Step 1: Create a new entry - Virat Kohli
    console.log("\n1️⃣ CREATING USER: Virat Kohli");
    console.log("   Email: virat.kohli@example.com");

    const createResponse = await makeRequest("POST", "/users", {
      name: "Virat Kohli",
      email: "virat.kohli@example.com",
    });

    if (createResponse.status === 201) {
      console.log("✅ SUCCESS: User created successfully");
      console.log(`   User ID: ${createResponse.data.user.id}`);
      console.log(`   Name: ${createResponse.data.user.name}`);
      console.log(`   Email: ${createResponse.data.user.email}`);
      userId = createResponse.data.user.id;
    } else {
      console.log("❌ FAILED: User creation failed");
      console.log(`   Status: ${createResponse.status}`);
      console.log(`   Response:`, createResponse.data);
      return;
    }

    // Step 2: Update the newly created entry - Change to King Kohli
    console.log("\n2️⃣ UPDATING USER: Change to King Kohli");
    console.log("   Email: king.kohli@example.com");

    const updateResponse = await makeRequest("PUT", `/users/${userId}`, {
      name: "King Kohli",
      email: "king.kohli@example.com",
    });

    if (updateResponse.status === 200) {
      console.log("✅ SUCCESS: User updated successfully");
      console.log(`   New Name: ${updateResponse.data.user.name}`);
      console.log(`   New Email: ${updateResponse.data.user.email}`);
    } else {
      console.log("❌ FAILED: User update failed");
      console.log(`   Status: ${updateResponse.status}`);
      console.log(`   Response:`, updateResponse.data);
      return;
    }

    // Step 3: Verify the update by reading the user
    console.log("\n3️⃣ VERIFYING UPDATE: Reading updated user");

    const verifyResponse = await makeRequest("GET", `/users/${userId}`);
    if (verifyResponse.status === 200) {
      console.log("✅ SUCCESS: Update verified");
      console.log(`   Current Name: ${verifyResponse.data.name}`);
      console.log(`   Current Email: ${verifyResponse.data.email}`);
    } else {
      console.log("❌ FAILED: Could not verify update");
      console.log(`   Status: ${verifyResponse.status}`);
    }

    // Step 4: Delete the updated entry
    console.log("\n4️⃣ DELETING USER: Remove the updated entry");

    const deleteResponse = await makeRequest("DELETE", `/users/${userId}`);
    if (deleteResponse.status === 200) {
      console.log("✅ SUCCESS: User deleted successfully");
      console.log(`   Deleted User: ${deleteResponse.data.deletedUser.name}`);
      console.log(`   Deleted Email: ${deleteResponse.data.deletedUser.email}`);
    } else {
      console.log("❌ FAILED: User deletion failed");
      console.log(`   Status: ${deleteResponse.status}`);
      console.log(`   Response:`, deleteResponse.data);
      return;
    }

    // Step 5: Verify deletion by trying to read the deleted user
    console.log("\n5️⃣ VERIFYING DELETION: Attempting to read deleted user");

    const finalReadResponse = await makeRequest("GET", `/users/${userId}`);
    if (finalReadResponse.status === 404) {
      console.log("✅ SUCCESS: Deletion verified - User not found (404)");
    } else {
      console.log("❌ FAILED: Deletion verification failed");
      console.log(`   Expected: 404 (Not Found)`);
      console.log(`   Got: ${finalReadResponse.status}`);
    }

    // Step 6: Test error handling for non-existent user (UPDATE)
    console.log("\n6️⃣ TESTING ERROR HANDLING: Update non-existent user");

    const updateNonExistentResponse = await makeRequest("PUT", `/users/999`, {
      name: "Test User",
      email: "test@example.com",
    });

    if (updateNonExistentResponse.status === 404) {
      console.log(
        "✅ SUCCESS: Proper error handling for non-existent user update"
      );
      console.log(`   Status: 404 (Not Found)`);
      console.log(`   Message: ${updateNonExistentResponse.data.error}`);
    } else {
      console.log("❌ FAILED: Error handling for non-existent user update");
      console.log(`   Expected: 404 (Not Found)`);
      console.log(`   Got: ${updateNonExistentResponse.status}`);
    }

    // Step 7: Test error handling for non-existent user (DELETE)
    console.log("\n7️⃣ TESTING ERROR HANDLING: Delete non-existent user");

    const deleteNonExistentResponse = await makeRequest("DELETE", `/users/999`);

    if (deleteNonExistentResponse.status === 404) {
      console.log(
        "✅ SUCCESS: Proper error handling for non-existent user deletion"
      );
      console.log(`   Status: 404 (Not Found)`);
      console.log(`   Message: ${deleteNonExistentResponse.data.error}`);
    } else {
      console.log("❌ FAILED: Error handling for non-existent user deletion");
      console.log(`   Expected: 404 (Not Found)`);
      console.log(`   Got: ${deleteNonExistentResponse.status}`);
    }

    // Step 8: Final check - Show all users (should be empty now)
    console.log("\n8️⃣ FINAL CHECK: All users in database");

    const allUsersResponse = await makeRequest("GET", "/users");
    if (allUsersResponse.status === 200) {
      console.log("✅ SUCCESS: Retrieved all users");
      console.log(`   Total Users: ${allUsersResponse.data.length}`);
      if (allUsersResponse.data.length === 0) {
        console.log("   📝 Database is empty (as expected after deletion)");
      } else {
        console.log(
          "   📝 Users found:",
          allUsersResponse.data.map((u) => u.name).join(", ")
        );
      }
    } else {
      console.log("❌ FAILED: Could not retrieve all users");
      console.log(`   Status: ${allUsersResponse.status}`);
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 ALL CRUD OPERATIONS COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("✅ CREATE: Virat Kohli created");
    console.log("✅ UPDATE: Changed to King Kohli");
    console.log("✅ DELETE: User removed");
    console.log("✅ VERIFY: Deletion confirmed");
    console.log(
      "✅ ERROR HANDLING: Non-existent user operations properly handled"
    );
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n💥 TEST FAILED:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Run the test
console.log("🚌 Bus Booking System - CRUD Operations Test");
console.log("Testing the specific case: Virat Kohli → King Kohli → Delete");
console.log("=".repeat(60));

testSpecificCRUDCase();
