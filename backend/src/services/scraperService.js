const axios = require('axios');
const cheerio = require('cheerio');
const { scanText } = require('./scannerService');

/**
 * Scrapes a public URL and performs landing page compliance audit
 */
async function scanUrl({ url, platform = 'meta' }) {
  if (!url || typeof url !== 'string') {
    throw new Error('Valid URL is required.');
  }

  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    const response = await axios.get(targetUrl, {
      timeout: 12000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 ScriptSentinelBot/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      maxRedirects: 5,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove noise elements
    $('script, style, noscript, svg, iframe').remove();

    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    
    // Extract headers and main body text
    const headings = [];
    $('h1, h2, h3').each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) headings.push(txt);
    });

    const bodyTextParts = [];
    $('p, li, blockquote, span').each((_, el) => {
      const txt = $(el).text().trim();
      if (txt.length > 20) {
        bodyTextParts.push(txt);
      }
    });

    const fullExtractedText = [title, metaDescription, ...headings, ...bodyTextParts].join('\n\n');

    // Run text scanner on scraped content
    const scanResult = await scanText({ text: fullExtractedText, platform });

    // Landing Page Specific Checks
    const lowerHtml = html.toLowerCase();
    const hasPrivacyPolicy = lowerHtml.includes('privacy policy') || lowerHtml.includes('privacy-policy');
    const hasTermsOfService = lowerHtml.includes('terms of service') || lowerHtml.includes('terms and conditions');
    const hasDisclaimer = lowerHtml.includes('disclaimer') || lowerHtml.includes('earnings disclaimer') || lowerHtml.includes('results may vary');
    const hasContactEmail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi.test(html);
    const hasCountdownTimer = lowerHtml.includes('countdown') || lowerHtml.includes('timer') || lowerHtml.includes('hurry');

    const landingPageAudits = [
      {
        check: 'Privacy Policy Link Visible',
        passed: hasPrivacyPolicy,
        importance: 'Mandatory on Meta & Google Ads',
        recommendation: hasPrivacyPolicy ? 'Passed' : 'Add a clear Privacy Policy link in your footer.',
      },
      {
        check: 'Terms of Service Link Visible',
        passed: hasTermsOfService,
        importance: 'Mandatory on All Ad Platforms',
        recommendation: hasTermsOfService ? 'Passed' : 'Add Terms of Service link in your footer.',
      },
      {
        check: 'Earnings / Health Disclaimer',
        passed: hasDisclaimer,
        importance: 'High for Supplements, Financial, & Coaching',
        recommendation: hasDisclaimer ? 'Passed' : 'Add standard "Results may vary" disclaimer to avoid FTC compliance strikes.',
      },
      {
        check: 'Verifiable Contact Information',
        passed: hasContactEmail,
        importance: 'High for Ad Quality Score',
        recommendation: hasContactEmail ? 'Passed' : 'Ensure a valid support email or phone number is clearly displayed.',
      },
      {
        check: 'Artificial Urgency / Resetting Countdown Detection',
        passed: !hasCountdownTimer,
        importance: 'Medium (Meta penalizes fake urgency)',
        recommendation: !hasCountdownTimer ? 'Passed' : 'Avoid countdown timers that reset on reload; use authentic deadline dates.',
      },
    ];

    // Recalculate combined compliance grade
    let missingMandatoryCount = 0;
    if (!hasPrivacyPolicy) missingMandatoryCount++;
    if (!hasTermsOfService) missingMandatoryCount++;
    if (!hasDisclaimer) missingMandatoryCount++;

    const combinedScore = Math.min(100, scanResult.shadowbanRiskScore + missingMandatoryCount * 15);

    return {
      url: targetUrl,
      title,
      metaDescription,
      extractedHeadingsCount: headings.length,
      extractedParagraphsCount: bodyTextParts.length,
      landingPageAudits,
      scanResult: {
        ...scanResult,
        shadowbanRiskScore: combinedScore,
      },
      scannedAt: new Date(),
    };
  } catch (error) {
    throw new Error(`Failed to crawl URL ${targetUrl}: ${error.message}`);
  }
}

module.exports = {
  scanUrl,
};
