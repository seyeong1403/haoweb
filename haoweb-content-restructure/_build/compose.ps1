# 페이지 조립기: _build/_chrome.html(서브페이지 공용 크롬) + _src/*.frag.html 본문 → 완성 페이지
# (index.html은 2026-07-27 새 디자인으로 승격되어 크롬 소스에서 분리됨. 서브 크롬은 _chrome.html이 기준)
# frag 형식: 1행=<title>, 2행=meta description, 3행~=main 내부 HTML
$dir  = Split-Path $PSScriptRoot -Parent
$idx  = [IO.File]::ReadAllText((Join-Path $PSScriptRoot '_chrome.html'))
$enc  = New-Object System.Text.UTF8Encoding($false)

$mainOpen = '<main id="main">'
$headTpl = $idx.Substring(0, $idx.IndexOf($mainOpen) + $mainOpen.Length)
$footTpl = $idx.Substring($idx.IndexOf('</main>'))

# 템플릿·데이터 없는 상세: 검색엔진 수집 차단(noindex)
# content-production/operation은 GNB 실 메뉴(AI 가시성)로 복원 → noindex 해제
# portfolio/interview 목록·상세는 실데이터 확보 전까지 noindex(가짜 사례 색인 방지)
$noindex = @('renewal-proposal.html','portfolio.html','portfolio-detail.html','interview.html','interview-detail.html')

Get-ChildItem (Join-Path $PSScriptRoot '_src\*.frag.html') | ForEach-Object {
  $lines = [IO.File]::ReadAllLines($_.FullName)
  $title = $lines[0]; $desc = $lines[1]
  $body  = ($lines | Select-Object -Skip 2) -join "`n"
  $head  = $headTpl -replace '<title>[^<]*</title>', ('<title>' + $title + '</title>')
  $head  = $head -replace '(<meta name="description" content=")[^"]*(")', ('${1}' + $desc + '${2}')
  $name  = $_.Name -replace '\.frag\.html$', '.html'
  if ($noindex -contains $name) {
    $head = $head -replace '(<meta name="description"[^>]*/>)', ('$1' + "`n  " + '<meta name="robots" content="noindex, nofollow" />')
  }
  $out   = $head + "`n" + $body + "`n  " + $footTpl
  [IO.File]::WriteAllText((Join-Path $dir $name), $out, $enc)
  Write-Host "built: $name"
}
