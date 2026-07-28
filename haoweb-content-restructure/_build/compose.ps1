# 페이지 조립기: _build/_chrome.html(서브페이지 공용 크롬) + _src/*.frag.html 본문 → 완성 페이지
# (index.html은 2026-07-27 새 디자인으로 승격되어 크롬 소스에서 분리됨. 서브 크롬은 _chrome.html이 기준)
# frag 형식: 1행=<title>, 2행=meta description, 3행~=main 내부 HTML
$dir  = Split-Path $PSScriptRoot -Parent
$idx  = [IO.File]::ReadAllText((Join-Path $PSScriptRoot '_chrome-x.html'))
$enc  = New-Object System.Text.UTF8Encoding($false)

$mainOpen = '<main id="main">'
$headTpl = $idx.Substring(0, $idx.IndexOf($mainOpen) + $mainOpen.Length)
$footTpl = $idx.Substring($idx.IndexOf('</main>'))

# 상세 템플릿(portfolio-detail/interview-detail/column-detail)은 _build/_templates로 이동 → 조립하지 않음.
# portfolio/interview는 완성된 '준비중' 페이지로 공개(GNB 노출) → 색인 허용.
# renewal-proposal은 free-proposal?type=renewal로 리다이렉트(통합) → noindex.
$noindex = @('renewal-proposal.html')

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
