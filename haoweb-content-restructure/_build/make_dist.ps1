# 배포 폴더 생성기
# - review/ : 대표님 검토용 전체 빌드(모든 페이지 포함, 검색엔진 비색인)
# - dist/   : 실제 공개용(docs·_build·archive·백업·데이터 없는 상세·미노출 페이지 제외)
$src  = Split-Path $PSScriptRoot -Parent
$dist = Join-Path $src 'dist'
$review = Join-Path $src 'review'
$enc  = New-Object System.Text.UTF8Encoding($false)

# 데이터 유무 판정(실제 데이터가 없으면 포트폴리오·인터뷰 공개 제외)
function Has-Data([string]$rel) {
  $p = Join-Path $src $rel
  if (-not (Test-Path $p)) { return $false }
  $t = ([IO.File]::ReadAllText($p)).Trim()
  return ($t -ne '[]' -and $t.Length -gt 3)
}
$hasPortfolio = Has-Data 'src/data/portfolio.json'
$hasInterview = Has-Data 'src/data/interview.json'

$assets = @('css','js','assets','src')

# ---------- review/ : 전체 ----------
if (Test-Path $review) { Remove-Item $review -Recurse -Force }
New-Item -ItemType Directory -Force $review | Out-Null
Get-ChildItem $src -File -Filter *.html | Copy-Item -Destination $review
foreach ($d in $assets) { if (Test-Path (Join-Path $src $d)) { Copy-Item (Join-Path $src $d) (Join-Path $review $d) -Recurse } }
# review 전체 noindex 표식
"User-agent: *`nDisallow: /" | Out-File (Join-Path $review 'robots.txt') -Encoding utf8

# ---------- dist/ : 공개용 ----------
if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
New-Item -ItemType Directory -Force $dist | Out-Null

# 미노출: 통합/폐기 페이지, 데이터 없는 상세 템플릿, 실데이터 없는 목록, 공지, 칼럼 상세 데모
# seo/aeo/geo는 AI 가시성 하위 실제 페이지로 공개. content-production/operation은 통합 후 리다이렉트
$excludePages = @('renewal-proposal.html','content-production.html','content-operation.html',
                  'portfolio-detail.html','interview-detail.html','column-detail.html','notice.html')
if (-not $hasPortfolio) { $excludePages += 'portfolio.html' }
if (-not $hasInterview) { $excludePages += 'interview.html' }

Get-ChildItem $src -File -Filter *.html | Where-Object { $excludePages -notcontains $_.Name } | Copy-Item -Destination $dist
foreach ($d in $assets) { if (Test-Path (Join-Path $src $d)) { Copy-Item (Join-Path $src $d) (Join-Path $dist $d) -Recurse } }

function New-Redirect([string]$name, [string]$to) {
  $html = @"
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex" />
  <meta http-equiv="refresh" content="0;url=$to" />
  <link rel="canonical" href="$($to -replace '\?.*$','')" />
  <title>이동 중 — 하오웹</title>
</head>
<body><p><a href="$to">이동하지 않으면 여기를 눌러 주세요.</a></p></body>
</html>
"@
  [IO.File]::WriteAllText((Join-Path $dist $name), $html, $enc)
}
New-Redirect 'renewal-proposal.html' 'free-proposal.html?type=renewal'
New-Redirect 'content-production.html' 'ai-content.html'
New-Redirect 'content-operation.html' 'maintenance.html'

$dcount = (Get-ChildItem $dist -Recurse -File).Count
$rcount = (Get-ChildItem $review -Recurse -File).Count
Write-Host "review built: $rcount files (전체)"
Write-Host "dist built: $dcount files (portfolio=$hasPortfolio interview=$hasInterview, 리다이렉트 3)"
Write-Host "dist 미노출: $($excludePages -join ', ')"
