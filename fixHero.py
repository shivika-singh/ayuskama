import re

with open('client/index.html', 'r') as f:
    content = f.read()

# Replace the current <section class="hero" id="home"> with the new premium hero layout
hero_replacement = """
    <!-- Premium Hero Section -->
    <section class="hero-section" id="home">
        <div class="hero-content reveal delay-100">
            <h1>Ayur<span>veda</span> Retreat & Training Center</h1>
            <p>Experience authentic healing and comprehensive Ayurveda courses in the spiritual heart of Rishikesh, India.</p>
            <div style="margin-top: 2rem; display: flex; gap: 15px; justify-content: center;">
                <a href="#courses" class="btn magnetic-btn" style="padding: 15px 30px; display: inline-block; text-decoration: none;">View Courses</a>
                <a href="patient-login.html" class="nav-btn-outline magnetic-btn" style="padding: 15px 30px; display: inline-block; text-decoration: none; border-radius: 2px;">Patient Portal</a>
            </div>
        </div>
    </section>
"""

# Extract the old hero section
content = re.sub(r'<section class="hero" id="home">.*?</section>', hero_replacement, content, flags=re.DOTALL)

with open('client/index.html', 'w') as f:
    f.write(content)

print("Hero section updated to match premium theme.")
