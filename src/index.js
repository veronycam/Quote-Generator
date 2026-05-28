const input = document.getElementById("topicInput");
const btn = document.getElementById("generateBtn");
const outputCard = document.getElementById("outputCard");
const quoteText = document.getElementById("quoteText");
const errorMsg = document.getElementById("errorMsg");

// Allow Enter key to trigger generation
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") generateQuote();
});

async function generateQuote() {
  const topic = input.value.trim();
  errorMsg.classList.remove("visible");

  if (!topic) {
    errorMsg.classList.add("visible");
    input.focus();
    return;
  }

  // Show loading state
  btn.classList.add("loading");
  btn.innerHTML = `<span class="loader"><span></span><span></span><span></span></span>`;
  outputCard.classList.remove("visible");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Generate a single original, inspiring, and thought-provoking quote about the topic: "${topic}".
The quote should be 1–3 sentences, poetic but clear, and feel genuinely wise — not cliché.
Respond ONLY with the quote text, no quotation marks, no attribution, no extra commentary.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const quote = data.content?.[0]?.text?.trim();

    if (!quote) throw new Error("No quote returned");

    // Show output card and animate text
    quoteText.textContent = "";
    outputCard.classList.add("visible");

    // Typewriter effect
    let i = 0;
    const speed = Math.max(18, Math.min(40, 2000 / quote.length));
    const typeInterval = setInterval(() => {
      quoteText.textContent += quote[i];
      i++;
      if (i >= quote.length) clearInterval(typeInterval);
    }, speed);
  } catch (err) {
    console.error(err);
    quoteText.textContent = "Something went wrong. Please try again.";
    outputCard.classList.add("visible");
  } finally {
    btn.classList.remove("loading");
    btn.textContent = "Generate Quote";
  }
}

function copyQuote() {
  const text = quoteText.textContent;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const copyBtn = document.querySelector(".output-actions .btn-secondary");
    copyBtn.textContent = "✓ Copied!";
    setTimeout(() => (copyBtn.textContent = "📋 Copy"), 2000);
  });
}
