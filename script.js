window.addEventListener('DOMContentLoaded', (event) => {
    const popup = document.getElementById('popup');
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');
    const createProfileButton = document.getElementById('createProfile');
  
    function showPopup() {
      popup.classList.remove('hidden');
    }
  
    function hidePopup() {
      popup.classList.add('hidden');
    }
  
    function createProfile() {
      const name = nameInput.value;
      const password = passwordInput.value;
  
      // Hier müsste der Code für die Kommunikation mit dem Backend eingefügt werden,
      // um das Benutzerprofil anzulegen
  
      console.log('Profil angelegt:');
      console.log('Name:', name);
      console.log('Passwort:', password);
  
      hidePopup();
    }
  
    createProfileButton.addEventListener('click', createProfile);
  
    showPopup();
  });
  