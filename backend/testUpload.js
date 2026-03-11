import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function testUpload() {
  try {
    const ts = Date.now();
    let token = "";
    try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            name: `TestUser${ts}`,
            email: `testuser${ts}@example.com`,
            password: 'Password123!',
        });
        token = res.data.token;
        console.log("Registered!");
    } catch(err) {
        console.log("Register error:", err.response?.data || err.message);
        return;
    }

    const form = new FormData();
    form.append('name', 'Updated Name');
    form.append('bio', 'Updated bio text');
    
    // Create a dummy image
    fs.writeFileSync('test.jpg', Buffer.from('fake image data'));
    form.append('avatarFile', fs.createReadStream('test.jpg'));

    console.log("Uploading...");
    const putRes = await axios.put('http://localhost:5000/api/auth/profile', form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders()
      }
    });
    
    console.log("Upload Success:", putRes.data);
    fs.unlinkSync('test.jpg');
    
  } catch (err) {
    console.log("Error:", err.response?.data || err.message);
  }
}
testUpload();
