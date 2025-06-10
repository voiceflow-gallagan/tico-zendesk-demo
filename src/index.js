/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// This runs only on Worker init (so you see your log at deploy/start)
console.log('Tico Zendesk demo running. Ready to catch some tickets!');

function encodeEmail(email) {
	// Basic base64, URL-safe
	return btoa(email).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function generateSessionID(email) {
	const userID = encodeEmail(email);
	const timestamp = Date.now(); // milliseconds since epoch
	return `${userID}-${timestamp}`;
}

export default {
	async fetch(request, env, ctx) {
		const VALID_API_KEY = env.VALID_API_KEY;
		const VF_API_KEY = env.VF_API_KEY;
		const VF_PROJECT_ID = env.VF_PROJECT_ID;
		const VF_VERSION_ID = env.VF_VERSION_ID || 'development';

		const url = new URL(request.url);

		// --- /health endpoint ---
		if (url.pathname === '/health') {
			return new Response(JSON.stringify({ status: 'ok', message: 'Tico Zendesk running' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// --- / root endpoint: show name and version ---
		if (url.pathname === '/' && request.method === 'GET') {
			return new Response(
				JSON.stringify({
					name: 'Tico Zendesk',
					version: '0.1.2 BETA',
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// --- /webhook endpoint: handle Zendesk ticket webhook ---
		if (url.pathname === '/webhook' && request.method === 'POST') {
			const apiKey = request.headers.get('x-api-key');
			if (apiKey !== VALID_API_KEY) {
				return new Response('Unauthorized', { status: 401 });
			}
			try {
				const payload = await request.json();
				console.log('--- Incoming Zendesk Webhook ---');
				console.log('Payload:', JSON.stringify(payload, null, 2));
				const userEmail = (payload?.requesterEmail && payload.requesterEmail.toLowerCase()) || null;
				console.log('userEmail:', userEmail);

				if (!userEmail || (userEmail != 'nicolas@gallagan.fr' && userEmail != 'nicolas.arcay@voiceflow.com')) {
					return new Response(JSON.stringify({ status: 'ignore', payload }), {
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					});
				}

				const userID = encodeEmail(userEmail);
				const timestamp = Date.now();
				const sessionID = generateSessionID(userEmail);
				const eventData = { ...payload };

				ctx.waitUntil(
					(async () => {
						// const vfUrl = `https://general-runtime.voiceflow.com/state/user/${userID}-${timestamp}/interact?logs=off`;
						const vfUrl = `https://general-runtime.voiceflow.com/state/user/zdcf1-${userID}/interact?logs=off`;
						const vfBody = JSON.stringify({
							action: {
								type: 'event',
								payload: {
									event: {
										name: 'answer_email',
										data: {
											...eventData,
											sessionID: sessionID,
										},
									},
								},
							},
							config: {
								tts: false,
								stripSSML: true,
								stopAll: false,
								excludeTypes: ['block', 'debug', 'flow'],
							},
						});

						const vfResponse = await fetch(vfUrl, {
							method: 'POST',
							headers: {
								accept: 'application/json',
								'content-type': 'application/json',
								authorization: VF_API_KEY,
								sessionID: sessionID,
								versionID: VF_VERSION_ID,
							},
							body: vfBody,
						});

						const data = await vfResponse.json();

						console.log('--- Voiceflow Response ---');
						console.log('Status:', vfResponse.status);
						console.log('Status Text:', vfResponse.statusText);

						// 2. Prepare and send transcript request
						const transcriptUrl = 'https://api.voiceflow.com/v2/transcripts';
						const transcriptBody = JSON.stringify({
							user: {
								name: userEmail, // or pull from elsewhere if you have better display names
							},
							sessionID: sessionID, // or whatever you use for the session/user ID
							versionID: VF_VERSION_ID,
							projectID: VF_PROJECT_ID,
							browser: 'zendesk',
						});

						await fetch(transcriptUrl, {
							method: 'PUT',
							headers: {
								accept: 'application/json',
								'content-type': 'application/json',
								authorization: VF_API_KEY,
							},
							body: transcriptBody,
						});
					})()
				);

				return new Response(JSON.stringify({ status: 'received' }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			} catch (err) {
				return new Response(`Internal error: ${err}`, { status: 500 });
			}
		}

		// --- Default fallback (for all other routes) ---
		return new Response('Not found', { status: 404 });
	},
};
