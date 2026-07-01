if (!localStorage.getItem('currentUser')) {
    window.location.replace('signin.html');
}

window.addEventListener('load', function() {
    var loader = document.getElementById('globalLoadingScreen');
    if (loader) loader.style.display = 'none';

    var darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'on') {
        document.body.classList.add('dark');
    }

    loadProfile();
});

function loadProfile() {
    var user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    document.getElementById('profileFullName').textContent = user.firstName + ' ' + (user.lastName || '');
    document.getElementById('profileEmailDisplay').textContent = user.email || '';
    document.getElementById('editFirstName').value = user.firstName || '';
    document.getElementById('editLastName').value = user.lastName || '';
    document.getElementById('editEmail').value = user.email || '';
    document.getElementById('editSex').value = user.sex || 'female';
    document.getElementById('editLocation').value = user.location || '';
    document.getElementById('halalStatus').textContent = user.isHalal ? 'Yes' : 'No';

    if (user.profilePhoto) {
        document.getElementById('profilePhoto').src = user.profilePhoto;
        document.getElementById('profilePhoto').style.display = 'block';
        document.getElementById('avatarPlaceholder').style.display = 'none';
    }
}

function changePhoto(input) {
    var file = input.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        var photoImg = document.getElementById('profilePhoto');
        var placeholder = document.getElementById('avatarPlaceholder');

        photoImg.src = e.target.result;
        photoImg.style.display = 'block';
        placeholder.style.display = 'none';

        var user = JSON.parse(localStorage.getItem('currentUser'));
        user.profilePhoto = e.target.result;
        localStorage.setItem('currentUser', JSON.stringify(user));

        var allUsers = JSON.parse(localStorage.getItem('users')) || [];
        for (var i = 0; i < allUsers.length; i++) {
            if (allUsers[i].email === user.email) {
                allUsers[i].profilePhoto = e.target.result;
            }
        }
        localStorage.setItem('users', JSON.stringify(allUsers));

        // Also update navbar avatar on this page immediately
        var avatarEls = document.querySelectorAll('.avatar');
        avatarEls.forEach(function(avatarEl) {
            avatarEl.innerHTML = '<img src="' + e.target.result + '" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
        });
    };
    reader.readAsDataURL(file);
}

function saveProfile() {
    var user = JSON.parse(localStorage.getItem('currentUser'));
    var allUsers = JSON.parse(localStorage.getItem('users')) || [];

    var newFirst = document.getElementById('editFirstName').value.trim();
    var newLast = document.getElementById('editLastName').value.trim();
    var newSex = document.getElementById('editSex').value;
    var newLoc = document.getElementById('editLocation').value.trim();

    if (!newFirst || !newLast) {
        showToast('First and Last name are required.');
        return;
    }

    user.firstName = newFirst;
    user.lastName = newLast;
    user.sex = newSex;
    user.location = newLoc;

    localStorage.setItem('currentUser', JSON.stringify(user));

    for (var i = 0; i < allUsers.length; i++) {
        if (allUsers[i].email === user.email) {
            allUsers[i].firstName = newFirst;
            allUsers[i].lastName = newLast;
            allUsers[i].sex = newSex;
            allUsers[i].location = newLoc;
        }
    }
    localStorage.setItem('users', JSON.stringify(allUsers));

    document.getElementById('profileFullName').textContent = newFirst + ' ' + newLast;
    showToast('Profile updated successfully!');
}

function showToast(msg) {
    var toast = document.getElementById('toastMsg');
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(function() {
        toast.style.display = 'none';
    }, 3000);
}
