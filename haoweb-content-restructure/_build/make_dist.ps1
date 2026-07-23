# 배포 폴더 생성기: 공개 파일만 dist/에 복사 (소스·기획 문서·백업과 분리)
# - 제외: docs/, _build/, dist/, 백업·프래그먼트
# - 템플릿(실데이터 전 비공개): portfolio-detail, interview-detail → dist 미포함
# - GNB 비노출 통합 대상: seo/aeo/geo → search-ai 리다이렉트 스텁, renewal-proposal → free-proposal?type=renewal 스텁
$src  = Split-Path $PSScriptRoot -Parent
$dist = Join-Path $src 'dist'
$enc  = New-Object System.Text.UTF8Encoding($false)

if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
New-Item -ItemType Directory -Force $dist | Out-Null

$excludePages = @('portfolio-detail.html','interview-detail.html','seo.html','aeo.html','geo.html','renewal-proposal.html')
Get-ChildItem $src -File -Filter *.html | Where-Object { $excludePages -notcontains $_.Name } | Copy-Item -Destination $dist
foreach ($d in @('css','js','assets')) { Copy-Item (Join-Path $src $d) (Join-Path $dist $d) -Recurse }

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
New-Redirect 'seo.html' 'search-ai.html'
New-Redirect 'aeo.html' 'search-ai.html'
New-Redirect 'geo.html' 'search-ai.html'
New-Redirect 'renewal-proposal.html' 'free-proposal.html?type=renewal'

$count = (Get-ChildItem $dist -Recurse -File).Count
Write-Host "dist built: $count files (docs/_build/템플릿 제외, 리다이렉트 4)"
