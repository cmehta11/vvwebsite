# 📧 FORM BACKEND SETUP GUIDE

## 🚨 IMPORTANT: Forms Need Backend to Send Emails

Your website has **3 forms** that require backend setup:
1. **Career Application Form** (work-with-us.html) - ⚠️ **NEEDS SETUP**
2. Contact Form (contact.html) - ⚠️ **NEEDS SETUP**
3. Quote Request Form (maintenance.html) - ⚠️ **NEEDS SETUP**

---

## ✅ OPTION 1: Formspree (RECOMMENDED)

### **Why Formspree?**
✅ Free tier (50 submissions/month)  
✅ 5-minute setup  
✅ No coding required  
✅ Email notifications automatic  
✅ Spam protection included  
✅ Form data dashboard  

### **Step-by-Step Setup:**

#### **Step 1: Sign Up (2 minutes)**
1. Go to https://formspree.io
2. Click "Get Started"
3. Sign up with your email
4. Verify your email

#### **Step 2: Create Form (1 minute)**
1. Click "New Form"
2. Enter form name: "Career Applications"
3. Enter your email where submissions should go
4. Click "Create"
5. **Copy the form endpoint** (looks like: `https://formspree.io/f/xwkgzqjy`)

#### **Step 3: Update Website (2 minutes)**
1. Open **work-with-us.html**
2. Find line 134:
   ```html
   <form action="https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT" method="POST"
   ```
3. Replace `YOUR_FORMSPREE_ENDPOINT` with your actual endpoint:
   ```html
   <form action="https://formspree.io/f/xwkgzqjy" method="POST"
   ```
4. Save the file

#### **Step 4: Repeat for Other Forms (5 minutes)**

**For contact.html:**
1. Create another form in Formspree: "Contact Form"
2. Get endpoint
3. Update contact.html form action

**For maintenance.html:**
1. Create another form: "Quote Requests"
2. Get endpoint
3. Update maintenance.html form action

#### **Step 5: Test (1 minute)**
1. Go to your live website
2. Fill out career form
3. Submit
4. Check your email - you should receive the submission!

---

## ✅ OPTION 2: Netlify Forms

### **If You Deploy on Netlify:**

#### **Step 1: Add netlify Attribute**
Replace the form opening tags:

**work-with-us.html** (line 134):
```html
<!-- BEFORE -->
<form action="..." method="POST" class="career-application-form">

<!-- AFTER -->
<form name="career-application" method="POST" netlify class="career-application-form">
```

**contact.html:**
```html
<form name="contact" method="POST" netlify class="contact-form">
```

**maintenance.html:**
```html
<form name="quote-request" method="POST" netlify class="quote-form">
```

#### **Step 2: Deploy to Netlify**
1. Deploy your site to Netlify
2. Done! Netlify handles everything automatically

#### **Step 3: Access Submissions**
1. Go to Netlify dashboard
2. Click on your site
3. Go to "Forms" tab
4. See all submissions

---

## ✅ OPTION 3: Web3Forms

### **Alternative to Formspree:**

#### **Step 1: Get Access Key**
1. Go to https://web3forms.com
2. Enter your email
3. Get access key

#### **Step 2: Update Forms**
```html
<form action="https://api.web3forms.com/submit" method="POST">
    <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
    <!-- rest of form fields -->
</form>
```

---

## ✅ OPTION 4: EmailJS (Client-Side)

### **Sends emails directly from browser:**

#### **Step 1: Sign Up**
1. Go to https://www.emailjs.com
2. Sign up (free tier: 200 emails/month)
3. Connect your email service (Gmail, Outlook, etc.)

#### **Step 2: Create Email Template**
1. Go to Email Templates
2. Create template for career applications
3. Get template ID

#### **Step 3: Add EmailJS Script**
Add to work-with-us.html (before closing `</body>`):
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    emailjs.init("YOUR_PUBLIC_KEY");
    
    document.getElementById('careerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
            .then(() => {
                alert('Application submitted successfully!');
                this.reset();
            }, (error) => {
                alert('Failed to submit. Please try again.');
            });
    });
</script>
```

---

## ⚠️ OPTION 5: Custom Backend (Advanced)

### **If you want full control:**

#### **Node.js + SendGrid Example:**

```javascript
// server.js
const express = require('express');
const sgMail = require('@sendgrid/mail');

const app = express();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json());

app.post('/api/career-application', async (req, res) => {
    const msg = {
        to: 'careers@vertvista.com',
        from: 'noreply@vertvista.com',
        subject: 'New Career Application',
        html: generateEmailHTML(req.body)
    };
    
    try {
        await sgMail.send(msg);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send' });
    }
});

app.listen(3000);
```

**Requirements:**
- Node.js hosting (Heroku, AWS, DigitalOcean)
- SendGrid account or SMTP service
- Coding knowledge
- Server maintenance

---

## 📊 Comparison Table

| Feature | Formspree | Netlify | Web3Forms | EmailJS | Custom Backend |
|---------|-----------|---------|-----------|---------|----------------|
| **Setup Time** | 5 min | 2 min | 5 min | 10 min | Hours/Days |
| **Free Tier** | 50/month | 100/month | Unlimited | 200/month | Depends |
| **Spam Protection** | ✅ | ✅ | ✅ | ❌ | You build |
| **Dashboard** | ✅ | ✅ | ❌ | ✅ | You build |
| **No Coding** | ✅ | ✅ | ✅ | Basic JS | Advanced |
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Varies |
| **Cost** | Free-$10 | Free | Free | Free-$15 | Variable |

---

## 🎯 RECOMMENDATION

**For Vertvista, I recommend Option 1 (Formspree):**

### **Why?**
✅ **Fastest setup** - 5 minutes total  
✅ **No technical skills needed** - Just paste endpoint URL  
✅ **Reliable** - Industry-standard service  
✅ **Free tier sufficient** - 50 submissions/month is plenty to start  
✅ **Dashboard included** - See all submissions in one place  
✅ **Spam protected** - Built-in spam filtering  
✅ **Email notifications** - Instant alerts on submissions  

### **Perfect for:**
- Launching quickly
- Non-technical team
- Testing demand
- Scaling later if needed

---

## 📝 Quick Setup Checklist

### **Using Formspree (RECOMMENDED):**
- [ ] Sign up at formspree.io
- [ ] Create 3 forms (Career, Contact, Quote)
- [ ] Get 3 endpoint URLs
- [ ] Update work-with-us.html (line 134)
- [ ] Update contact.html form action
- [ ] Update maintenance.html form action
- [ ] Re-publish website
- [ ] Test all 3 forms
- [ ] Receive email confirmations

**Total Time:** 15 minutes

---

## 🐛 Troubleshooting

### **Form not submitting?**
1. Check endpoint URL is correct
2. Verify email in Formspree is confirmed
3. Check browser console for errors
4. Try in incognito mode (clear cache)

### **Not receiving emails?**
1. Check spam folder
2. Verify Formspree email settings
3. Check email is correct in Formspree
4. Test with another email address

### **Formspree 403 error?**
1. You hit free tier limit (50/month)
2. Upgrade to paid plan ($10/month)
3. Or use Web3Forms (unlimited)

---

## 💡 Pro Tips

### **Email Templates:**
Customize Formspree email notifications:
1. Go to Formspree dashboard
2. Click on your form
3. Go to "Notifications"
4. Customize subject line and email template

### **Auto-Reply:**
Send confirmation email to applicants:
1. Go to form settings
2. Enable "Auto-reply"
3. Set reply-to email field: `email`
4. Write confirmation message

### **Spam Protection:**
Add honeypot field (already included in forms):
```html
<input type="text" name="_gotcha" style="display:none">
```

### **Redirect After Submit:**
```html
<input type="hidden" name="_next" value="https://vertvista.com/thank-you.html">
```

---

## 📞 Need Help?

### **Formspree Support:**
- Docs: https://help.formspree.io
- Email: help@formspree.io

### **Alternative Services:**
- Web3Forms: https://docs.web3forms.com
- EmailJS: https://www.emailjs.com/docs
- Netlify Forms: https://docs.netlify.com/forms

---

## ✅ After Setup

Once forms are working:
1. ✅ Test each form multiple times
2. ✅ Setup email filters/labels for submissions
3. ✅ Create response templates for common questions
4. ✅ Set response time SLA (e.g., reply within 24 hours)
5. ✅ Monitor submission volume
6. ✅ Consider upgrading if hitting limits

---

*Last Updated: 2025-11-08*  
*Recommended: Formspree (Option 1)*  
*Setup Time: 15 minutes*

🚀 **Setup your forms and start receiving applications!** 🚀