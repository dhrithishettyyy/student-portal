$env:PATH = "C:\Users\jayak\AppData\Local\Programs\nodejs;" + $env:PATH
Write-Host "🔄 Starting ReRoute: Adaptive AI Study Planner..." -ForegroundColor Cyan
Start-Process "http://localhost:5173/"
npm run dev
