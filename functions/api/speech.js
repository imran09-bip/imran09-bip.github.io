// Bengali voice-cloning proxy for the public CosyVoice3 demo.
// The reference clip belongs to the app owner and is used with their consent.
const SPACE = 'https://kawshikbuet17-bengali-cosyvoice3-tts-demo.hf.space';
const REF_PATH = '/voice/porosh-reference.wav';

export async function onRequestPost({ request }) {
  const origin = request.headers.get('Origin');
  const requestOrigin = new URL(request.url).origin;
  if (origin && origin !== requestOrigin) return Response.json({ error: 'অননুমোদিত অনুরোধ।' }, { status: 403 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'ভয়েসের লেখা পড়া যায়নি।' }, { status: 400 }); }
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text || text.length > 450) return Response.json({ error: 'লেখা খালি অথবা ৪৫০ অক্ষরের বেশি। ছোট অংশে শুনুন।' }, { status: 400 });
  try {
    // Upload the owner's fixed 20-second reference clip to the running Gradio Space.
    const refResponse = await fetch(new URL(REF_PATH, request.url));
    if (!refResponse.ok) throw new Error('আপনার রেফারেন্স ভয়েস ফাইল পাওয়া যায়নি।');
    const form = new FormData();
    form.append('files', new Blob([await refResponse.arrayBuffer()], { type: 'audio/wav' }), 'porosh-reference.wav');
    const uploadResponse = await fetch(`${SPACE}/gradio_api/upload`, { method: 'POST', body: form });
    if (!uploadResponse.ok) throw new Error('ভয়েস সার্ভারে রেফারেন্স পাঠানো যায়নি।');
    const uploaded = await uploadResponse.json();
    const filePath = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    if (!filePath) throw new Error('রেফারেন্স অডিও আপলোড সম্পন্ন হয়নি।');

    const callResponse = await fetch(`${SPACE}/gradio_api/call/generate_cross_lingual_audio`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [text, { path: filePath, meta: { _type: 'gradio.FileData' } }, 1, 0] })
    });
    if (!callResponse.ok) throw new Error('AI ভয়েস তৈরি শুরু করা যায়নি।');
    const callData = await callResponse.json();
    const eventId = callData.event_id;
    if (!eventId) throw new Error('AI ভয়েস সার্ভার কোনো কাজের আইডি দেয়নি।');
    const resultResponse = await fetch(`${SPACE}/gradio_api/call/generate_cross_lingual_audio/${eventId}`);
    if (!resultResponse.ok) throw new Error('AI ভয়েসের ফলাফল পাওয়া যায়নি।');
    const stream = await resultResponse.text();
    const dataLines = stream.split('\n').filter(line => line.startsWith('data:'));
    let result;
    for (const line of dataLines.reverse()) {
      try { const parsed = JSON.parse(line.slice(5).trim()); if (Array.isArray(parsed) && parsed.length) { result = parsed; break; } } catch {}
    }
    const audioInfo = result?.[0];
    const audioUrl = audioInfo?.url || (audioInfo?.path ? `${SPACE}/gradio_api/file=${encodeURIComponent(audioInfo.path)}` : null);
    if (!audioUrl) throw new Error('AI অডিও তৈরি হয়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।');
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) throw new Error('তৈরি অডিও ডাউনলোড করা যায়নি।');
    return new Response(audioResponse.body, { headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'বাংলা ভয়েস তৈরি করা যায়নি।' }, { status: 502 });
  }
}
