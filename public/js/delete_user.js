// Delete user account
document.getElementById('delete-account').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
            await axios.delete('/api/user/current'); // Assuming there's an endpoint for the current user
            alert('Your account has been deleted. You will be logged out.');
            window.location.href = '/logout'; // Redirect to logout page or home
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An error occurred while deleting your account. Please try again.');
        }
    }
});