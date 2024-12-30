import newsletterService from '../firebase/services/newsletterService.js';

async function runTests() {
  try {
    console.log('--- Starting Newsletter Tests ---');

    // Test adding posts
    console.log('\nAdding test posts:');
    const posts = [
      {
        title: "Grand Opening Weekend",
        content: "Join us for our grand opening celebration this weekend with special discounts!",
        author: "Manager Sarah",
        image: "https://example.com/grand-opening.jpg"
      },
      {
        title: "Meet Our New Chef",
        content: "We're excited to welcome Chef John with 15 years of experience.",
        author: "HR Team"
      },
      {
        title: "Special Holiday Menu",
        content: "Check out our festive specials for the holiday season.",
        author: "Chef John",
        image: "https://example.com/holiday-menu.jpg"
      }
    ];

    for (const post of posts) {
      const addedPost = await newsletterService.addPost(post);
      console.log('Added post:', addedPost);
    }

    // Get all posts
    console.log('\nGetting all posts:');
    const allPosts = await newsletterService.getAllPosts();
    console.log('All posts:', allPosts);

    // Update a post
    if (allPosts.length > 0) {
      console.log('\nUpdating first post:');
      const updatePost = allPosts[0];
      const updatedPost = await newsletterService.updatePost(updatePost.id, {
        content: "UPDATED: Grand opening celebration with amazing discounts and free appetizers!"
      });
      console.log('Updated post:', updatedPost);

      // Delete a post
      console.log('\nDeleting last post:');
      const deletePost = allPosts[allPosts.length - 1];
      await newsletterService.deletePost(deletePost.id);
      console.log('Deleted post with ID:', deletePost.id);
    }

    // Get final state
    console.log('\nFinal posts after operations:');
    const finalPosts = await newsletterService.getAllPosts();
    console.log(finalPosts);

  } catch (error) {
    console.error('Error in newsletter tests:', error);
  }
}

runTests(); 