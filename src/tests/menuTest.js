import menuService from '../firebase/services/menuService.js';

// Test function to add menu items with different category scenarios
async function testAddMenuItems() {
  try {
    const items = [
      {
        name: "Butter Chicken",
        price: 14.99,
        description: "Creamy, rich Indian curry with tender chicken",
        spiceLevel: "Medium",
        categories: ["Main Course", "Curry", "Popular"],
        discountPrice: 12.99
      },
      {
        name: "Plain Naan",
        price: 3.99,
        description: "Traditional Indian bread",
        spiceLevel: "None",
        categories: ["Bread"]
      },
      {
        name: "Vindaloo",
        price: 15.99,
        description: "Spicy curry with potatoes",
        spiceLevel: "Hot",
        discountPrice: 13.99
      }
    ];

    for (const item of items) {
      const addedItem = await menuService.addMenuItem(item);
      console.log('Successfully added menu item:', addedItem);
    }
  } catch (error) {
    console.error('Error in testAddMenuItems:', error);
  }
}

// Test function to get all menu items
async function testGetAllMenuItems() {
  try {
    const items = await menuService.getAllMenuItems();
    console.log('All menu items:', items);
    return items;
  } catch (error) {
    console.error('Error in testGetAllMenuItems:', error);
  }
}

// Run tests
async function runTests() {
  console.log('--- Starting Menu Tests ---');
  
  console.log('\nTesting addMenuItem with different scenarios:');
  await testAddMenuItems();
  
  console.log('\nTesting getAllMenuItems:');
  const items = await testGetAllMenuItems();
  
  if (items && items.length > 0) {
    console.log('\nTesting updateMenuItem:');
    const updateItem = items[0];
    const updatedItem = await menuService.updateMenuItem(updateItem.id, {
      price: 16.99,
      spiceLevel: "Medium-Hot",
      discountPrice: 14.99
    });
    console.log('Updated item:', updatedItem);
  }
  
  console.log('\n--- Tests Completed ---');
}

// Run all tests
runTests(); 