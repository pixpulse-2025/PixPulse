# Google OAuth Setup Guide - Step by Step

## 🎯 Complete Setup Instructions

Follow these steps to set up Google OAuth for PixPulse:

---

## Step 1: Access Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Sign in with your Google account

2. **Accept Terms of Service** (if prompted)
   - Read and accept the terms
   - Click "Agree and Continue"

---

## Step 2: Create a New Project

1. **Click on Project Dropdown**
   - Located at the top of the page (next to "Google Cloud")
   - Click "NEW PROJECT"

2. **Fill Project Details**
   ```
   Project Name: PixPulse
   Organization: (Leave as default or select your org)
   Location: (Leave as default)
   ```

3. **Click "CREATE"**
   - Wait for project creation (takes a few seconds)
   - You'll see a notification when ready

4. **Select Your Project**
   - Click on the project dropdown again
   - Select "PixPulse" from the list

---

## Step 3: Enable Google+ API

1. **Open Navigation Menu**
   - Click the hamburger menu (☰) in top-left
   - Go to: **APIs & Services** → **Library**

2. **Search for Google+ API**
   - In the search bar, type: "Google+ API"
   - Click on "Google+ API" from results

3. **Enable the API**
   - Click the blue "ENABLE" button
   - Wait for it to enable (takes a few seconds)

---

## Step 4: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - Click hamburger menu (☰)
   - Navigate to: **APIs & Services** → **OAuth consent screen**

2. **Choose User Type**
   - Select: **External** (for testing with any Google account)
   - Click "CREATE"

3. **Fill App Information**
   ```
   App name: PixPulse
   User support email: your-email@gmail.com
   App logo: (Optional - upload your logo if you have one)
   ```

4. **Fill App Domain** (Optional for development)
   ```
   Application home page: http://localhost:5173
   Application privacy policy link: (Leave blank for now)
   Application terms of service link: (Leave blank for now)
   ```

5. **Authorized Domains**
   - For development, you can skip this
   - For production, add your domain (e.g., pixpulse.com)

6. **Developer Contact Information**
   ```
   Email addresses: your-email@gmail.com
   ```

7. **Click "SAVE AND CONTINUE"**

8. **Scopes Page**
   - Click "ADD OR REMOVE SCOPES"
   - Select these scopes:
     - ✅ `.../auth/userinfo.email`
     - ✅ `.../auth/userinfo.profile`
     - ✅ `openid`
   - Click "UPDATE"
   - Click "SAVE AND CONTINUE"

9. **Test Users** (For External apps in testing)
   - Click "ADD USERS"
   - Add your Gmail addresses (for testing)
   - Click "ADD"
   - Click "SAVE AND CONTINUE"

10. **Summary**
    - Review your settings
    - Click "BACK TO DASHBOARD"

---

## Step 5: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - Click hamburger menu (☰)
   - Navigate to: **APIs & Services** → **Credentials**

2. **Create Credentials**
   - Click "+ CREATE CREDENTIALS" at the top
   - Select "OAuth client ID"

3. **Configure OAuth Client**
   ```
   Application type: Web application
   Name: PixPulse Web Client
   ```

4. **Authorized JavaScript Origins**
   - Click "+ ADD URI"
   - Add these URIs:
     ```
     http://localhost:5173
     http://localhost:3000
     ```

5. **Authorized Redirect URIs**
   - Click "+ ADD URI"
   - Add these URIs:
     ```
     http://localhost:5173
     http://localhost:5173/auth/google/callback
     ```

6. **Click "CREATE"**

7. **Copy Your Credentials** ⚠️ IMPORTANT
   - A popup will show your credentials
   - **Client ID**: Copy this (looks like: `123456789-abc...xyz.apps.googleusercontent.com`)
   - **Client Secret**: Copy this (looks like: `GOCSPX-...`)
   - Click "OK"

---

## Step 6: Save Credentials to Your Project

### Backend (.env)

1. **Open** `backend/.env`

2. **Add these lines:**
   ```env
   # Google OAuth
   GOOGLE_CLIENT_ID=paste_your_client_id_here
   GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

3. **Replace** `paste_your_client_id_here` with your actual Client ID
4. **Replace** `paste_your_client_secret_here` with your actual Client Secret

### Frontend (.env)

1. **Open** `frontend/.env`

2. **Add this line:**
   ```env
   VITE_GOOGLE_CLIENT_ID=paste_your_client_id_here
   ```

3. **Replace** `paste_your_client_id_here` with your actual Client ID

---

## Step 7: Verify Setup

### Check Your Credentials

1. **Go back to Google Cloud Console**
   - Navigate to: **APIs & Services** → **Credentials**

2. **You should see:**
   - OAuth 2.0 Client IDs section
   - Your "PixPulse Web Client" listed

3. **Click on your client name** to view/edit:
   - Client ID
   - Client Secret
   - Authorized URIs

---

## 🔒 Security Best Practices

### DO:
- ✅ Keep Client Secret private (never commit to Git)
- ✅ Add `.env` to `.gitignore`
- ✅ Use environment variables
- ✅ Rotate credentials if exposed

### DON'T:
- ❌ Share Client Secret publicly
- ❌ Commit credentials to GitHub
- ❌ Use production credentials in development
- ❌ Hardcode credentials in code

---

## 📝 Quick Reference

### Your Credentials Location

**Google Cloud Console:**
```
https://console.cloud.google.com
→ Select "PixPulse" project
→ APIs & Services
→ Credentials
→ OAuth 2.0 Client IDs
→ PixPulse Web Client
```

**Local Files:**
```
backend/.env          → GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
frontend/.env         → VITE_GOOGLE_CLIENT_ID
```

---

## 🧪 Testing Your Setup

### 1. Check Environment Variables

**Backend:**
```bash
cd backend
node -e "require('dotenv').config(); console.log('Client ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...');"
```

**Frontend:**
```bash
cd frontend
# Check if .env file exists and has VITE_GOOGLE_CLIENT_ID
cat .env | grep VITE_GOOGLE_CLIENT_ID
```

### 2. Test OAuth Flow

1. Start both servers:
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2
   cd frontend && npm run dev
   ```

2. Open browser: `http://localhost:5173/login`

3. Click "Continue with Google" button

4. Should see Google sign-in popup

5. Select your Google account

6. Grant permissions

7. Should redirect back to your app

---

## ❓ Troubleshooting

### Error: "redirect_uri_mismatch"

**Solution:**
- Go to Google Cloud Console → Credentials
- Edit your OAuth client
- Make sure redirect URIs match exactly:
  - `http://localhost:5173`
  - `http://localhost:5173/auth/google/callback`
- No trailing slashes
- Correct port number

### Error: "invalid_client"

**Solution:**
- Check Client ID and Secret are correct
- Make sure no extra spaces when copying
- Verify .env file is loaded
- Restart your servers after changing .env

### Error: "access_denied"

**Solution:**
- User cancelled the sign-in
- Or app is not verified (add yourself as test user)
- Go to OAuth consent screen → Test users → Add your email

### Can't Find Credentials

**Solution:**
- Make sure you selected the correct project
- Check project dropdown at top of Google Cloud Console
- Navigate to: APIs & Services → Credentials

---

## 🎉 Success Checklist

- [ ] Created Google Cloud project "PixPulse"
- [ ] Enabled Google+ API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 credentials
- [ ] Copied Client ID and Client Secret
- [ ] Added credentials to backend/.env
- [ ] Added Client ID to frontend/.env
- [ ] Verified .env files are not in Git
- [ ] Tested environment variables load
- [ ] Ready to implement OAuth flow!

---

## 📚 Additional Resources

**Google Documentation:**
- OAuth 2.0: https://developers.google.com/identity/protocols/oauth2
- Sign-In: https://developers.google.com/identity/sign-in/web

**Common Issues:**
- https://stackoverflow.com/questions/tagged/google-oauth

---

## 🔄 For Production Deployment

When deploying to production:

1. **Create Production Credentials**
   - Create separate OAuth client for production
   - Use production domain (e.g., https://pixpulse.com)

2. **Update Authorized URIs**
   ```
   Authorized JavaScript origins:
   - https://pixpulse.com
   
   Authorized redirect URIs:
   - https://pixpulse.com
   - https://pixpulse.com/auth/google/callback
   ```

3. **Verify OAuth Consent Screen**
   - Submit for verification if needed
   - Add privacy policy and terms of service

4. **Update Environment Variables**
   - Use production credentials
   - Update FRONTEND_URL to production domain

---

## ✅ You're All Set!

Once you've completed these steps, you'll have:
- ✅ Google OAuth credentials
- ✅ Environment variables configured
- ✅ Ready to implement Google Sign-In

**Next Step:** Implement the Google OAuth code in your application!

---

**Need Help?**
- Google Cloud Console: https://console.cloud.google.com
- Support: https://cloud.google.com/support
- Documentation: https://developers.google.com/identity
