# Connecting to Host LLM Servers

You can use LLM servers running on your host machine (e.g. LM Studio, Ollama, llama.cpp server) alongside or instead of the built-in Ollama container.

The n8n container can reach the host via the special DNS name `host.docker.internal`, which is pre-configured in the app's Docker Compose setup.

---

## LM Studio

1. In LM Studio, open the **Local Server** tab and start the server.
2. In the server settings, set **"Server Binds To"** to `0.0.0.0` so Docker can reach it (default port is `1234`).
3. Load a model in LM Studio.
4. In n8n, create a new **OpenAI** credential:
   - **Base URL**: `http://host.docker.internal:1234/v1`
   - **API Key**: `lm-studio` (any non-empty string — LM Studio does not validate it)
5. In your workflow, use the **OpenAI** node and set the model name to match whatever model is loaded in LM Studio (e.g. `local-model`).

---

## Ollama (host-installed)

If you have Ollama installed directly on your host (outside Docker), you can connect to it as well.

### 1. Allow Ollama to accept connections from Docker

By default, Ollama binds to `127.0.0.1`, which is not reachable from inside a Docker container. You need to configure it to listen on all interfaces:

```bash
sudo systemctl edit ollama
```

Add the following and save:

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0"
```

Then restart the service:

```bash
sudo systemctl restart ollama
```

Verify it is now listening on all interfaces:

```bash
ss -tlnp | grep 11434
# Should show 0.0.0.0:11434
```

### 2. Configure the credential in n8n

Create a new **Ollama** credential in n8n:
- **Base URL**: `http://host.docker.internal:11434`

Or if you prefer to use the **OpenAI**-compatible interface:
- **Base URL**: `http://host.docker.internal:11434/v1`
- **API Key**: `ollama` (any non-empty string)

---

## Other OpenAI-compatible servers

Any server that implements the OpenAI API (llama.cpp server, vLLM, LocalAI, etc.) follows the same pattern:

| Setting | Value |
|---|---|
| Base URL | `http://host.docker.internal:<port>/v1` |
| API Key | any non-empty string if the server doesn't require auth |

Make sure the server is bound to `0.0.0.0` (not `127.0.0.1`) so it is reachable from the Docker network.

---

## Troubleshooting

**404 on `/v1/models`** — Check the Base URL field for trailing spaces. The URL must be exact with no extra whitespace.

**Connection refused** — The server is likely bound to `127.0.0.1` only. Configure it to listen on `0.0.0.0` as described above.

**`address already in use` when starting the server** — The server is already running (possibly as a system service). Stop the existing process or service before reconfiguring, or edit the service's environment as shown in the Ollama section.
