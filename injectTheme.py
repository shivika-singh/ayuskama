import os

client_dir = 'client'
for filename in os.listdir(client_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(client_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Check if already injected
        if 'ayuskama-theme.css' not in content:
            # Inject right after animations.css
            content = content.replace(
                '<link rel="stylesheet" href="animations.css">',
                '<link rel="stylesheet" href="animations.css">\n    <link rel="stylesheet" href="ayuskama-theme.css">'
            )
            
            # If animations.css wasn't found, try injecting before </head>
            if '<link rel="stylesheet" href="ayuskama-theme.css">' not in content:
                content = content.replace('</head>', '    <link rel="stylesheet" href="ayuskama-theme.css">\n</head>')

            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Injected theme into {filename}")

# Fix index.html specific layout issues (remove rounded padding for full width hero)
with open('client/index.html', 'r') as f:
    idx_content = f.read()

# Make hero section actually full width
idx_content = idx_content.replace('<div class="glass-panel" style="max-width: 1200px; margin: 40px auto; padding: 60px 40px; text-align: center;">', '<div class="hero-section"><div class="hero-content" style="max-width: 800px; margin: 0 auto; text-align: center; padding: 60px 20px;">')
idx_content = idx_content.replace('    <h1 class="hero-title reveal">', '    <h1 class="hero-title reveal">')

# Wait, I should just completely replace the container of the hero in index.html to match the new CSS
# But it's easier to just use regex to target the hero structure

with open('client/index.html', 'w') as f:
    f.write(idx_content)
    
print("Done.")
