# n8n Workflow: Zendesk Tico Demo

This file documents the `Zendesk Tico Demo` n8n workflow found in `extra/n8n/n8n_ZendeskTicoDemo.json`.

## Overview
This n8n workflow acts as a bridge between Zendesk and Voiceflow, automating the process of sending Zendesk ticket data to Voiceflow and saving the resulting transcript.

### Main Steps
1. **Webhook**: Receives a POST request from Zendesk containing ticket data (email, ticketId, status, etc.).
2. **Code**: Generates a unique session ID and user ID by encoding the requester's email and appending a timestamp.
3. **Voiceflow API**: Sends the ticket data and session info to the Voiceflow runtime API, triggering a Voiceflow event.
4. **Save Transcript**: Saves the session and user info to the Voiceflow transcripts API for tracking and analytics.

## Node Details
- **Webhook**: Entry point for Zendesk. Expects a JSON body with fields like `requesterEmail`, `ticketId`, `ticketStatus`, `requesterName`, `ticketSubject`, `ticketDescription`, and `ticketLatestComment`.
- **Code**: Custom JavaScript to encode the email and generate session/user IDs in a URL-safe way.
- **Voiceflow API**: Sends a POST request to Voiceflow's runtime API, passing ticket and session data as an event.
- **Save Transcript**: Sends a PUT request to Voiceflow's transcripts API to log the session and user for analytics.

## How to Import
1. Open your n8n instance.
2. Go to "Import Workflow" and select `extra/n8n/n8n_ZendeskTicoDemo.json` from this repo.
3. Update any credentials (API keys, endpoints) as needed for your environment.

## Customization
- You can modify the workflow to handle additional Zendesk fields or Voiceflow events as needed.
- Make sure to update credential nodes with your own API keys.

## File Location
- Workflow JSON: `extra/n8n/n8n_ZendeskTicoDemo.json`
- This README: `extra/n8n/README.n8n.md`
