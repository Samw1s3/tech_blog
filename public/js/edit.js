const postId = document.querySelector('input[name="post-id"').value;

const editForm = async function(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value;
    const body = document.querySelector('textarea[name="post-body"]').value;
    const postId = document.querySelector('input[name="post-id"]').value

    
    await fetch(`/api/post/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
            title: title,
            content: body,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    document.location.replace('/dashboard')
};

document.querySelector("#edit-post-form").addEventListener('submit', editForm)




