# API Backend

This backend provides a very small authentication endpoint for the app.

## Required environment variables

- `AUTH_CODE` - the verification code used by `/api/auth/verify`
- `MAX_ATTEMPTS` - optional, defaults to `5`
- `BLOCK_WINDOW_SECONDS` - optional, defaults to `900` (15 minutes)

## Local run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Example

```bash
export AUTH_CODE=123456
export MAX_ATTEMPTS=5
export BLOCK_WINDOW_SECONDS=900
uvicorn main:app --reload
```

On Windows PowerShell, use:

```powershell
$env:AUTH_CODE = "123456"
$env:MAX_ATTEMPTS = "5"
$env:BLOCK_WINDOW_SECONDS = "900"
uvicorn main:app --reload
```

## Notes

- The backend now blocks clients after too many failed verification attempts.
- `AUTH_CODE` must be set in the environment; the server will not start without it.
