Write-Host "Resetting project (deleting caches, node_modules, lockfiles)..."

# Delete node_modules, lockfiles, Next.js cache
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }
if (Test-Path .next) { Remove-Item -Recurse -Force .next }

# Optional: delete npm cache
npm cache clean --force | Out-Null

# Reinstall dependencies
Write-Host "Reinstalling dependencies..."
npm install




Write-Host "Done! Run 'npm run dev' to start your project."
