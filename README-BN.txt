নামায সহায়ক — GitHub Pages আপডেট

এই ZIP-এর ভিতরের namaz-sohayok-pages ফোল্ডারের সব ফাইল GitHub repository-র root-এ আপলোড/replace করতে হবে।

এই আপডেটে:
- ঘড়ির সময় আলাদা ফাংশনে প্রতি ১ সেকেন্ডে আপডেট হবে।
- tick() ফাংশনে তারিখের ভেরিয়েবল scope-এর ভুল ঠিক করা হয়েছে; এই ভুলে পরবর্তী নামাযের টেবিল/রিমাইন্ডার আপডেট বন্ধ হচ্ছিল।
- Service Worker cache version বাড়ানো হয়েছে।
- বাংলা ভয়েসে আপনার ২০ সেকেন্ডের voice/porosh-reference.wav রেফারেন্স ফাইল ব্যবহার করা হয়েছে।
- ভয়েসের জন্য GitHub Pages থেকে সরাসরি Bengali CosyVoice3 Gradio Space API কল করা হচ্ছে; Cloudflare Function আর ব্যবহার করা হচ্ছে না।
- একই লেখা প্রথমবার তৈরি হলে ফোনের IndexedDB-তে সংরক্ষিত হবে; পরে সেই একই লেখা cache থেকে বাজবে।

গুরুত্বপূর্ণ:
1. GitHub Pages কেবল static hosting; নিজে AI মডেল চালায় না। তাই নিজের কণ্ঠ তৈরি করতে Hugging Face-এর CosyVoice3 Space-এ ইন্টারনেট সংযোগ লাগবে।
2. সরাসরি browser-to-Gradio API কলের ক্ষেত্রে Space-এর CORS অনুমতি ও Space চালু থাকা জরুরি। যদি ব্রাউজারে CORS error আসে, তাহলে GitHub Pages একা দিয়ে সেই বাধা কাটানো সম্ভব নয়; তখন একটি API proxy/server লাগবে। এখানে কোনো API key বা গোপন key রাখা হয়নি।
3. ভয়েস প্রথমবার চালাতে ইন্টারনেট লাগবে। একই বাক্য পরে ক্যাশ থেকে অফলাইনে চলবে। প্রতিটি আলাদা বাক্য প্রথমবার অনলাইনে তৈরি করতে হবে।
4. ZIP-এর `voice/porosh-reference.wav` আপনার reference audio; এটিকে মুছবেন/নাম বদলাবেন না।
5. `functions/api/speech.js` ফাইলটি আগের Pages Function-এর অবশিষ্ট; GitHub Pages এটিকে চালাবে না। নতুন frontend এটি ব্যবহার করে না।

GitHub Pages deploy:
- ZIP extract করুন।
- namaz-sohayok-pages ফোল্ডারের ভেতরের সব ফাইল ও ফোল্ডার repository root-এ দিন।
- index.html, sw.js, manifest.webmanifest, icons/, voice/ ঠিক root-এ থাকবে।
- Commit/push করে Pages deploy সম্পন্ন হতে দিন।
- পুরনো PWA cache থাকলে সাইট একবার reload করুন; দরকার হলে browser site data clear করে আবার খুলুন।

নামাযের সময় জ্যোতির্বৈজ্ঞানিক হিসাবের ওপর নির্ভর করে; স্থানীয় মসজিদ/ইসলামিক ফাউন্ডেশনের সময়সূচির সঙ্গে মিলিয়ে নেবেন।
