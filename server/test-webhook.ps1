# 测试 Webhook 服务器的脚本

Write-Host "🧪 Webhook 服务器测试" -ForegroundColor Cyan
Write-Host "======================`n"

# 配置
$WEBHOOK_URL = "http://localhost:3000"
$WEBHOOK_SECRET = "your-webhook-secret"

# 测试健康检查
Write-Host "1️⃣  测试健康检查端点..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$WEBHOOK_URL/health" -Method Get -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ 健康检查通过" -ForegroundColor Green
        Write-Host "  响应: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ 健康检查失败" -ForegroundColor Red
    Write-Host "  错误: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 测试 Webhook 端点
Write-Host "2️⃣  测试 Webhook 端点..." -ForegroundColor Yellow

$body = @{
    repository = "test/repo"
    branch = "main"
    commit = "abc123"
    author = "test-user"
    message = "测试提交"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "X-Webhook-Secret" = $WEBHOOK_SECRET
}

try {
    $response = Invoke-WebRequest -Uri "$WEBHOOK_URL/webhook" -Method Post -Body $body -Headers $headers -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Webhook 触发成功" -ForegroundColor Green
        Write-Host "  响应: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Webhook 触发失败" -ForegroundColor Red
    Write-Host "  错误: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================`n" -ForegroundColor Cyan
Write-Host "提示: 请确保 Webhook 服务器正在运行" -ForegroundColor Yellow
Write-Host "启动命令: cd server && node webhook-server.js" -ForegroundColor Gray
