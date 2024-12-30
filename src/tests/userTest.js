import userService from '../firebase/services/userService.js';

async function testUsers() {
  try {
    console.log('--- Starting User Tests ---');

    // Test user registration
    console.log('\nTesting user registration:');
    const users = [
      { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'testPassword123' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', password: 'testPassword123' },
      { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', password: 'testPassword123' }
    ];

    const registeredUsers = [];
    for (const user of users) {
      try {
        const newUser = await userService.registerUser(user);
        console.log('Registered user:', newUser);
        registeredUsers.push(newUser);
      } catch (error) {
        if (error.message.includes('auth/email-already-in-use')) {
          console.log(`Email ${user.email} already in use, logging in instead.`);
          const existingUser = await userService.loginUser(user.email, user.password);
          console.log('Logged in user:', existingUser);
          registeredUsers.push(existingUser);
        } else {
          throw error;
        }
      }
    }

    // Modify one user
    console.log('\nModifying user:');
    const userToModify = registeredUsers[0];
    const updatedUser = await userService.updateUser(userToModify.uid, { lastName: 'Updated' });
    console.log('Updated user:', updatedUser);

    // Delete one user
    console.log('\nDeleting user:');
    const userToDelete = registeredUsers[1];
    await userService.deleteUser(userToDelete.uid);
    console.log('Deleted user with ID:', userToDelete.uid);

    // Verify remaining users
    console.log('\nVerifying remaining users:');
    for (const user of registeredUsers) {
      if (user.uid !== userToDelete.uid) {
        const currentUser = await userService.getCurrentUser();
        console.log('Current user:', currentUser);
      }
    }

    console.log('\n--- Tests Completed Successfully ---');

  } catch (error) {
    console.error('Error in user tests:', error);
    throw error; // Re-throw to ensure the error is visible
  }
}

testUsers(); 