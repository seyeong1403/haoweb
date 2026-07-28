# ============================================================
# gen-nav.ps1 - GNB single source (_build/nav.json) -> static inject into all pages
#   New design: index.html / renewal.html  (<nav class="gnb"> + .mnav)
#   Old design: _build/_chrome.html         (<nav class="hd-nav"> + .m-panel) -> compose.ps1 fans out to 46 subpages
#   Portfolio / interview: included only when src/data/*.json has real data (conditional).
#   Replaces the region between <!--MARKER:START--> and <!--MARKER:END--> (seeds once if markers absent).
#   NOTE: keep this script ASCII-only. All Korean text lives in nav.json (PS 5.1 misreads BOM-less UTF-8 .ps1).
# ============================================================
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$enc  = New-Object System.Text.UTF8Encoding($false)
$nav  = Get-Content (Join-Path $PSScriptRoot 'nav.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$ui   = $nav.ui

function Has-Data([string]$rel) {
  $p = Join-Path $root $rel
  if (-not (Test-Path $p)) { return $false }
  $t = ([IO.File]::ReadAllText($p)).Trim()
  return ($t -ne '[]' -and $t.Length -gt 3)
}
$has = @{ portfolio = (Has-Data 'src/data/portfolio.json'); interview = (Has-Data 'src/data/interview.json') }

function Is-Visible($c) {
  if ($c.PSObject.Properties.Name -contains 'cond' -and $c.cond) { return [bool]$has[$c.cond] }
  return $true
}
function Sub-Links($item) {   # returns concatenated <a> for visible children
  $s = ''
  foreach ($c in $item.children) { if (Is-Visible $c) { $s += ('<a href="' + $c.href + '">' + $c.label + '</a>') } }
  return $s
}
function Top-Href($item) {     # conditional landing (e.g. insight -> portfolio.html when data exists)
  if ($item.PSObject.Properties.Name -contains 'hrefWhenData' -and $item.hrefWhenData) {
    foreach ($k in $item.hrefWhenData.PSObject.Properties.Name) { if ($has[$k]) { return $item.hrefWhenData.$k } }
  }
  return $item.href
}

# ---------- New design: .gnb ----------
$gnbLines = @()
foreach ($it in $nav.primary) {
  $wide = ''
  if ($it.PSObject.Properties.Name -contains 'wide' -and $it.wide) { $wide = ' gnb__d--wide' }
  $gnbLines += ('    <div class="gnb__i" data-key="' + $it.key + '"><a href="' + (Top-Href $it) + '">' + $it.label + '</a>')
  $gnbLines += ('      <div class="gnb__d' + $wide + '">' + (Sub-Links $it) + '</div>')
  $gnbLines += '    </div>'
}
$gnbX = '<nav class="gnb" id="gnb" aria-label="' + $ui.aria + '">' + "`n" + ($gnbLines -join "`n") + "`n" + '  </nav>'

# ---------- New design: .mnav ----------
$mtopLines = @()
foreach ($it in $nav.primary) { $mtopLines += ('<a href="' + (Top-Href $it) + '" data-key="' + $it.key + '">' + $it.label + '</a>') }
$mnavX = '<div class="mnav" id="mnav" hidden>' + "`n  " + ($mtopLines -join '') + "`n" +
         '  <a class="mnav__cta" href="free-proposal.html">' + $ui.ctaPrimary + '</a>' + "`n" + '</div>'

# ---------- Old design: .hd-nav ----------
$hdLines = @()
foreach ($it in $nav.primary) {
  $hdLines += ('        <div data-key="' + $it.key + '"><a href="' + (Top-Href $it) + '">' + $it.label + '</a>')
  $hdLines += ('          <div class="hd-sub">' + (Sub-Links $it) + '</div>')
  $hdLines += '        </div>'
}
$hdNav = '<nav class="hd-nav" aria-label="' + $ui.aria + '">' + "`n" + ($hdLines -join "`n") + "`n" + '      </nav>'

# ---------- Old design: .m-panel ----------
$mpLines = @()
foreach ($it in $nav.primary) {
  $mpLines += ('          <div class="m-grp" data-key="' + $it.key + '"><a href="' + (Top-Href $it) + '">' + $it.label + '</a>')
  $mpLines += ('            <div class="m-sub">' + (Sub-Links $it) + '</div>')
  $mpLines += '          </div>'
}
$mcta = '          <div class="m-cta">' + "`n" +
        '            <a class="btn btn-primary btn-block" href="free-proposal.html">' + $ui.ctaPrimary + '</a>' + "`n" +
        '            <a class="btn btn-ghost btn-block" href="inquiry.html">' + $ui.ctaGhost + '</a>' + "`n" +
        '          </div>'
$mPanel = '<div class="m-panel" id="m-panel">' + "`n" + ($mpLines -join "`n") + "`n" + $mcta + "`n" + '        </div>'

# ---------- full footer (.hw-foot) ----------
$ft = $nav.footer
$colHtml = @()
foreach ($c in $ft.columns) {
  $links = ''
  foreach ($l in $c.links) { $links += ('<a href="' + $l.href + '">' + $l.label + '</a>') }
  $colHtml += ('      <nav aria-label="' + $c.title + '"><p class="ft-title">' + $c.title + '</p>' + $links + '</nav>')
}
$footer = '<footer class="hw-foot">' + "`n" +
  '  <div class="hw-foot__grid">' + "`n" +
  '    <div class="hw-foot__brand">' + "`n" +
  '      <a class="nav__l" href="index.html" aria-label="HAOWEB"><img class="foot__logo" src="assets/logo.png" alt="HAOWEB" /></a>' + "`n" +
  '      <p>' + $ft.tagline + '</p>' + "`n" +
  '      <p class="foot-contact" data-foot-contact></p>' + "`n" +
  '    </div>' + "`n" +
  ($colHtml -join "`n") + "`n" +
  '  </div>' + "`n" +
  '  <div class="hw-foot__base">' + "`n" +
  '    <span>' + $ft.copyright + '</span>' + "`n" +
  '    <span class="pending" data-cfg="company.bizNo" data-pending="' + $ft.bizPending + '"></span>' + "`n" +
  '    <a href="' + $ft.privacyHref + '">' + $ft.privacyLabel + '</a>' + "`n" +
  '  </div>' + "`n" +
  '</footer>'

# ---------- inject ----------
function Put([string]$file, [string]$marker, [string]$content, [string]$seed, [string]$seedTail) {
  $path = Join-Path $root $file
  $t = [IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
  $S = "<!--$marker" + ":START-->"; $E = "<!--$marker" + ":END-->"
  $block = $S + "`n" + $content + "`n" + $E
  if ($t.Contains($S)) {
    $pat = [regex]::Escape($S) + '[\s\S]*?' + [regex]::Escape($E)
    $t = [regex]::new($pat).Replace($t, { param($m) $block }, 1)
  } else {
    $t = [regex]::new($seed).Replace($t, { param($m) $block + $seedTail }, 1)
  }
  [IO.File]::WriteAllText($path, $t, $enc)
  Write-Host "injected: $file [$marker]"
}

Put 'index.html'            'GNB'    $gnbX   '<nav class="gnb"[\s\S]*?</nav>'   ''
Put 'index.html'            'MNAV'   $mnavX  '<div class="mnav"[\s\S]*?</div>'  ''
Put 'index.html'            'FOOTER' $footer '<footer class="foot"[\s\S]*?</footer>' ''
Put 'renewal.html'          'GNB'    $gnbX   '<nav class="gnb"[\s\S]*?</nav>'   ''
Put 'renewal.html'          'MNAV'   $mnavX  '<div class="mnav"[\s\S]*?</div>'  ''
Put 'renewal.html'          'FOOTER' $footer '<footer class="foot"[\s\S]*?</footer>' ''
# 신 디자인 서브 공용 크롬(compose 전환 후 46종 반영)
Put '_build/_chrome-x.html' 'GNB'    $gnbX   ''  ''
Put '_build/_chrome-x.html' 'MNAV'   $mnavX  ''  ''
Put '_build/_chrome-x.html' 'FOOTER' $footer ''  ''
# 구 크롬(전환 전까지 유지)
Put '_build/_chrome.html'   'HDNAV'  $hdNav  '<nav class="hd-nav"[\s\S]*?</nav>' ''
Put '_build/_chrome.html'   'MPANEL' $mPanel '<div class="m-panel" id="m-panel">[\s\S]*?</div>\s*</details>' "`n      </details>"

Write-Host ("done. portfolio={0} interview={1}" -f $has.portfolio, $has.interview)
