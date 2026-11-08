<#
.SYNOPSIS
    Fetches a Jira issue (ticket) as JSON from Jira Cloud.

.DESCRIPTION
    Calls the Jira Cloud REST API v3 using Basic auth (email + API token).
    Credentials are read from environment variables so they are never stored in the repo:
        JIRA_BASE_URL   e.g. https://rmtaitraining.atlassian.net   (optional, this is the default)
        JIRA_EMAIL      your Atlassian account email
        JIRA_API_TOKEN  your Atlassian API token

.EXAMPLE
    $env:JIRA_EMAIL = "you@company.com"
    $env:JIRA_API_TOKEN = "<token>"
    ./fetch-jira.ps1 -IssueKey PROJ-123
    ./fetch-jira.ps1 -IssueKey PROJ-123 -OutFile ticket.json
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$IssueKey,

    [string]$BaseUrl,
    [string]$Email,
    [string]$ApiToken,
    [string]$OutFile
)

$ErrorActionPreference = "Stop"

# Load the nearest .env (searching upward from this script) for any variable not already set.
$dir = $PSScriptRoot
while ($dir) {
    $envFile = Join-Path $dir ".env"
    if (Test-Path $envFile) {
        foreach ($line in Get-Content $envFile) {
            if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$') {
                $name  = $Matches[1]
                $value = $Matches[2].Trim('"', "'")
                if (-not [Environment]::GetEnvironmentVariable($name)) {
                    [Environment]::SetEnvironmentVariable($name, $value)
                }
            }
        }
        break
    }
    $dir = Split-Path $dir -Parent
}

if (-not $BaseUrl)  { $BaseUrl  = if ($env:JIRA_BASE_URL) { $env:JIRA_BASE_URL } else { "https://rmtaitraining.atlassian.net" } }
if (-not $Email)    { $Email    = $env:JIRA_EMAIL }
if (-not $ApiToken) { $ApiToken = $env:JIRA_API_TOKEN }

if (-not $Email -or -not $ApiToken) {
    Write-Error "Set JIRA_EMAIL and JIRA_API_TOKEN environment variables (or pass -Email / -ApiToken)."
    exit 1
}

$pair    = "{0}:{1}" -f $Email, $ApiToken
$encoded = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($pair))
$headers = @{
    Authorization = "Basic $encoded"
    Accept        = "application/json"
}

$uri = "{0}/rest/api/3/issue/{1}" -f $BaseUrl.TrimEnd("/"), $IssueKey

try {
    $response = Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
}
catch {
    Write-Error "Failed to fetch $IssueKey from $uri : $($_.Exception.Message)"
    exit 1
}

$json = $response | ConvertTo-Json -Depth 100

if ($OutFile) {
    $json | Set-Content -Path $OutFile -Encoding UTF8
    Write-Host "Saved $IssueKey to $OutFile"
}
else {
    $json
}
