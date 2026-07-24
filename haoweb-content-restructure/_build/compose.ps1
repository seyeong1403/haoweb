# 페이지 조립기: index.html의 헤더/푸터 크롬 + _src/*.frag.html 본문 → 완성 페이지
# frag 형식: 1행=<title>, 2행=meta description, 3행~=main 내부 HTML
$dir  = Split-Path $PSScriptRoot -Parent
$idx  = [IO.File]::ReadAllText((Join-Path $dir 'index.html'))
$enc  = New-Object System.Text.UTF8Encoding($false)

$mainOpen = '<main id="main">'
$headTpl = $idx.Substring(0, $idx.IndexOf($mainOpen) + $mainOpen.Length)
$footTpl = $idx.Substring($idx.IndexOf('</main>'))

# GNB 비노출·템플릿·통합 대상 페이지: 검색엔진 수집 차단(noindex)
# seo/aeo/geo는 AI 가시성 하위 실제 페이지로 복원 → noindex 해제
$noindex = @('renewal-proposal.html','portfolio-detail.html','interview-detail.html','content-production.html','content-operation.html')

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
