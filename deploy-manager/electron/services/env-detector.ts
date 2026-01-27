import fs from 'node:fs'
import path from 'node:path'

export class EnvDetector {
  static async detect(projectPath: string): Promise<Record<string, string>> {
    const envPath = path.join(projectPath, '.env')
    const examplePath = path.join(projectPath, '.env.example')
    
    let content = ''
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf8')
    } else if (fs.existsSync(examplePath)) {
      content = fs.readFileSync(examplePath, 'utf8')
    } else {
      return {}
    }

    const envVars: Record<string, string> = {}
    const lines = content.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      
      const [key, ...valueParts] = trimmed.split('=')
      if (key) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^['"]|['"]$/g, '')
      }
    }

    return envVars
  }

  static async getProjectInfo(projectPath: string) {
    const pkgPath = path.join(projectPath, 'package.json')
    const gitConfigPath = path.join(projectPath, '.git', 'config')
    
    // Helper to format names like "my-app-name" to "My App Name"
    const formatName = (s: string) => {
      return s
        .split(/[_-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    // Default to folder name as it's usually what the user calls it
    let name = formatName(path.basename(projectPath))

    // Check package.json but keep folder name if pkg name looks like a generic slug
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
        // Only override if folder name is something generic like "src" or "app"
        const folderName = path.basename(projectPath).toLowerCase()
        if (pkg.name && (folderName === 'src' || folderName === 'app' || folderName === 'project')) {
          name = formatName(pkg.name)
        }
      } catch (e) {}
    }

    let repoUrl = ''
    if (fs.existsSync(gitConfigPath)) {
      const gitConfig = fs.readFileSync(gitConfigPath, 'utf8')
      const match = gitConfig.match(/\[remote "origin"\][\s\S]*?url = (.*)/)
      if (match) {
        repoUrl = match[1].trim()
      }
    }

    return { name, repoUrl }
  }
}
