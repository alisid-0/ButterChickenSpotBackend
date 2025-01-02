import orderService from '../firebase/services/orderService.js';
import userService from '../firebase/services/userService.js';
import menuService from '../firebase/services/menuService.js';

async function testOrders() {
  try {
    console.log('--- Starting Order Tests ---');

    // Get existing test user
    const testUser = await userService.loginUser('john.doe@example.com', 'testPassword123');
    console.log('Using test user:', testUser.uid);

    // Get existing menu items
    const menuItems = await menuService.getAllMenuItems();
    console.log('Found menu items:', menuItems.length);

    // Create test orders
    console.log('\nTesting order creation:');
    const orders = [
      {
        userId: testUser.uid,
        items: [
          { 
            id: menuItems[0].id,
            name: menuItems[0].name,
            quantity: 2,
            price: menuItems[0].price
          }
        ],
        total: menuItems[0].price * 2,
        specialInstructions: 'Extra spicy please',
        contactNumber: '123-456-7890',
        paymentMethod: 'card'
      },
      {
        userId: testUser.uid,
        items: [
          {
            id: menuItems[0].id,
            name: menuItems[0].name,
            quantity: 1,
            price: menuItems[0].price
          },
          {
            id: menuItems[1].id,
            name: menuItems[1].name,
            quantity: 2,
            price: menuItems[1].price
          }
        ],
        total: menuItems[0].price + (menuItems[1].price * 2),
        specialInstructions: 'No onions',
        contactNumber: '123-456-7890',
        paymentMethod: 'cash'
      }
    ];

    const createdOrders = [];
    for (const order of orders) {
      const newOrder = await orderService.createOrder(order);
      console.log('Created order:', newOrder);
      createdOrders.push(newOrder);
    }

    // Test getting user orders
    console.log('\nTesting get user orders:');
    const userOrders = await orderService.getUserOrders(testUser.uid);
    console.log('User orders:', userOrders);

    // Test updating order status
    console.log('\nTesting order status update:');
    const updatedOrder = await orderService.updateOrderStatus(createdOrders[0].id, 'completed');
    console.log('Updated order status:', updatedOrder);

    console.log('\n--- Order Tests Completed Successfully ---');
  } catch (error) {
    console.error('Error in order tests:', error);
    throw error;
  }
}

testOrders(); 