/**
 * Demo Blog Posts for Fallback/Development Mode
 * Used when WordPress is not configured or unavailable
 */

import type { WordPressPost } from './wordpress-types';

export const DEMO_CATEGORIES = [
  { id: 1, name: 'Automation', slug: 'automation', count: 3 },
  { id: 2, name: 'AI Integration', slug: 'ai-integration', count: 2 },
  { id: 3, name: 'Business Tips', slug: 'business-tips', count: 2 },
  { id: 4, name: 'Case Studies', slug: 'case-studies', count: 1 },
];

export const DEMO_TAGS = [
  { id: 1, name: 'productivity', slug: 'productivity', count: 4 },
  { id: 2, name: 'efficiency', slug: 'efficiency', count: 3 },
  { id: 3, name: 'AI', slug: 'ai', count: 2 },
  { id: 4, name: 'workflow', slug: 'workflow', count: 3 },
  { id: 5, name: 'ROI', slug: 'roi', count: 2 },
];

export const DEMO_POSTS: WordPressPost[] = [
  {
    id: 1,
    date: '2024-11-15T10:00:00',
    date_gmt: '2024-11-15T10:00:00',
    modified: '2024-11-15T10:00:00',
    modified_gmt: '2024-11-15T10:00:00',
    slug: 'automation-guide-small-business',
    status: 'publish',
    type: 'post',
    link: '/blog/automation-guide-small-business',
    title: {
      rendered: '5 Ways Small Businesses Can Automate Their Operations Today'
    },
    content: {
      rendered: `
        <p>Business automation isn't just for large enterprises anymore. Small businesses can now leverage powerful automation tools to compete with larger competitors and dramatically improve their efficiency.</p>
        
        <h2>1. Automate Customer Communication</h2>
        <p>Set up automated email sequences for customer onboarding, follow-ups, and nurturing. Tools like email marketing platforms can send personalized messages based on customer behavior, saving hours of manual work each week.</p>
        
        <h2>2. Streamline Invoice and Payment Processing</h2>
        <p>Automatic invoice generation and payment reminders can reduce late payments by up to 40%. Modern accounting software can sync with your CRM to invoice clients immediately after service delivery.</p>
        
        <h2>3. Implement Smart Scheduling</h2>
        <p>Replace phone tag with automated booking systems. Clients can schedule appointments 24/7, and reminders are sent automatically, reducing no-shows by 60%.</p>
        
        <h2>4. Automate Social Media Posting</h2>
        <p>Schedule your social media content in batches and let automation tools post at optimal times. This ensures consistent online presence without daily manual posting.</p>
        
        <h2>5. Set Up Automated Reporting</h2>
        <p>Generate business reports automatically each week or month. Track key metrics without spending hours in spreadsheets.</p>
        
        <h3>Getting Started</h3>
        <p>Start with one area that causes the most friction in your business. Implement automation gradually, test thoroughly, and scale what works. Most businesses see ROI within the first 3 months.</p>
        
        <p><strong>Ready to automate your business?</strong> Schedule a free consultation to learn how we can help you implement these automation strategies.</p>
      `,
      protected: false
    },
    excerpt: {
      rendered: '<p>Discover five practical ways small businesses can start automating their operations today to save time, reduce errors, and improve customer satisfaction.</p>',
      protected: false
    },
    author: 1,
    featured_media: 1,
    comment_status: 'open',
    ping_status: 'open',
    sticky: true,
    template: '',
    format: 'standard',
    meta: [],
    categories: [1, 3],
    tags: [1, 2, 4],
    _embedded: {
      author: [{
        id: 1,
        name: 'GrowFast Team',
        url: '',
        description: 'Business automation experts',
        link: '',
        slug: 'growfast-team',
        avatar_urls: {
          24: 'https://via.placeholder.com/24',
          48: 'https://via.placeholder.com/48',
          96: 'https://via.placeholder.com/96'
        }
      }],
      'wp:featuredmedia': [{
        id: 1,
        date: '2024-11-15T10:00:00',
        slug: 'automation-hero',
        type: 'attachment',
        link: '',
        title: { rendered: 'Business Automation' },
        author: 1,
        caption: { rendered: '' },
        alt_text: 'Business automation dashboard',
        media_type: 'image',
        mime_type: 'image/jpeg',
        media_details: {
          width: 1200,
          height: 630,
          file: '',
          sizes: {}
        },
        source_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop'
      }],
      'wp:term': [
        [
          { id: 1, link: '', name: 'Automation', slug: 'automation', taxonomy: 'category' },
          { id: 3, link: '', name: 'Business Tips', slug: 'business-tips', taxonomy: 'category' }
        ],
        [
          { id: 1, link: '', name: 'productivity', slug: 'productivity', taxonomy: 'post_tag' },
          { id: 2, link: '', name: 'efficiency', slug: 'efficiency', taxonomy: 'post_tag' },
          { id: 4, link: '', name: 'workflow', slug: 'workflow', taxonomy: 'post_tag' }
        ]
      ]
    }
  },
  {
    id: 2,
    date: '2024-11-10T14:30:00',
    date_gmt: '2024-11-10T14:30:00',
    modified: '2024-11-10T14:30:00',
    modified_gmt: '2024-11-10T14:30:00',
    slug: 'ai-agents-business-transformation',
    status: 'publish',
    type: 'post',
    link: '/blog/ai-agents-business-transformation',
    title: {
      rendered: 'How AI Agents Are Transforming Business Operations in 2024'
    },
    content: {
      rendered: `
        <p>Artificial Intelligence is no longer a futuristic concept—it's here, and it's revolutionizing how businesses operate. AI agents are now capable of handling complex tasks that previously required human intervention.</p>
        
        <h2>What Are AI Agents?</h2>
        <p>AI agents are intelligent software programs that can perceive their environment, make decisions, and take actions to achieve specific goals. Unlike traditional automation, AI agents can adapt and learn from new situations.</p>
        
        <h2>Real-World Applications</h2>
        
        <h3>Customer Service</h3>
        <p>AI agents can handle up to 80% of routine customer inquiries, providing instant responses 24/7. They understand context, sentiment, and can escalate complex issues to human agents seamlessly.</p>
        
        <h3>Data Analysis</h3>
        <p>AI agents can analyze vast amounts of business data, identify patterns, and provide actionable insights that would take human analysts weeks to discover.</p>
        
        <h3>Process Optimization</h3>
        <p>By monitoring workflows in real-time, AI agents can identify bottlenecks, suggest improvements, and even implement optimization strategies automatically.</p>
        
        <h2>The ROI of AI Agents</h2>
        <p>Businesses implementing AI agents report:</p>
        <ul>
          <li>40-60% reduction in operational costs</li>
          <li>3x faster response times to customer inquiries</li>
          <li>90% accuracy in data processing tasks</li>
          <li>24/7 availability without additional staffing costs</li>
        </ul>
        
        <h2>Getting Started with AI Agents</h2>
        <p>The key is to start small. Identify one repetitive, rule-based process in your business. Implement an AI agent for that specific task, measure results, and scale from there.</p>
        
        <p><strong>Interested in AI integration?</strong> Our team specializes in implementing AI agents tailored to your business needs.</p>
      `,
      protected: false
    },
    excerpt: {
      rendered: '<p>Explore how AI agents are revolutionizing business operations and discover practical ways to implement AI in your organization for maximum ROI.</p>',
      protected: false
    },
    author: 1,
    featured_media: 2,
    comment_status: 'open',
    ping_status: 'open',
    sticky: false,
    template: '',
    format: 'standard',
    meta: [],
    categories: [2],
    tags: [3, 1, 2],
    _embedded: {
      author: [{
        id: 1,
        name: 'GrowFast Team',
        url: '',
        description: 'Business automation experts',
        link: '',
        slug: 'growfast-team',
        avatar_urls: {
          24: 'https://via.placeholder.com/24',
          48: 'https://via.placeholder.com/48',
          96: 'https://via.placeholder.com/96'
        }
      }],
      'wp:featuredmedia': [{
        id: 2,
        date: '2024-11-10T14:30:00',
        slug: 'ai-technology',
        type: 'attachment',
        link: '',
        title: { rendered: 'AI Technology' },
        author: 1,
        caption: { rendered: '' },
        alt_text: 'AI and machine learning visualization',
        media_type: 'image',
        mime_type: 'image/jpeg',
        media_details: {
          width: 1200,
          height: 630,
          file: '',
          sizes: {}
        },
        source_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop'
      }],
      'wp:term': [
        [
          { id: 2, link: '', name: 'AI Integration', slug: 'ai-integration', taxonomy: 'category' }
        ],
        [
          { id: 3, link: '', name: 'AI', slug: 'ai', taxonomy: 'post_tag' },
          { id: 1, link: '', name: 'productivity', slug: 'productivity', taxonomy: 'post_tag' },
          { id: 2, link: '', name: 'efficiency', slug: 'efficiency', taxonomy: 'post_tag' }
        ]
      ]
    }
  },
  {
    id: 3,
    date: '2024-11-05T09:15:00',
    date_gmt: '2024-11-05T09:15:00',
    modified: '2024-11-05T09:15:00',
    modified_gmt: '2024-11-05T09:15:00',
    slug: 'healthcare-practice-automation-case-study',
    status: 'publish',
    type: 'post',
    link: '/blog/healthcare-practice-automation-case-study',
    title: {
      rendered: 'Case Study: How One Medical Practice Saved 20 Hours Per Week with Automation'
    },
    content: {
      rendered: `
        <p>When Dr. Sarah Johnson approached us, her growing medical practice was drowning in administrative work. Patient scheduling, insurance verification, and follow-ups were consuming valuable time that could be spent on patient care.</p>
        
        <h2>The Challenge</h2>
        <p>The practice was spending:</p>
        <ul>
          <li>8 hours per week on appointment scheduling and reminders</li>
          <li>6 hours on insurance verification and pre-authorization</li>
          <li>4 hours on patient follow-up communications</li>
          <li>2 hours on reporting and documentation</li>
        </ul>
        
        <h2>Our Solution</h2>
        <p>We implemented a comprehensive automation system that included:</p>
        
        <h3>1. Smart Appointment Management</h3>
        <p>Automated booking system with intelligent scheduling, automatic reminders via SMS and email, and a waitlist management system that filled cancellations automatically.</p>
        
        <h3>2. Insurance Verification Automation</h3>
        <p>Real-time insurance eligibility checks integrated with their practice management system, automated pre-authorization requests, and instant verification status updates.</p>
        
        <h3>3. Patient Communication System</h3>
        <p>Automated post-visit follow-ups, prescription refill reminders, preventive care notifications, and patient satisfaction surveys.</p>
        
        <h3>4. Reporting Dashboard</h3>
        <p>Automated daily, weekly, and monthly reports with key practice metrics, financial summaries, and patient outcome tracking.</p>
        
        <h2>The Results</h2>
        <p>After 90 days of implementation:</p>
        <ul>
          <li><strong>20 hours saved per week</strong> in administrative tasks</li>
          <li><strong>35% reduction</strong> in no-show rates</li>
          <li><strong>90% faster</strong> insurance verification</li>
          <li><strong>45% increase</strong> in patient satisfaction scores</li>
          <li><strong>$4,000+ monthly savings</strong> in operational costs</li>
        </ul>
        
        <h2>Dr. Johnson's Feedback</h2>
        <blockquote>
          <p>"The automation system has been transformative. My staff can focus on patient care instead of paperwork, and our patients love the convenience. The ROI was evident within the first month."</p>
        </blockquote>
        
        <h2>Key Takeaways</h2>
        <p>This case demonstrates that even complex, regulated industries like healthcare can benefit tremendously from thoughtful automation. The key is to:</p>
        <ul>
          <li>Start with the most time-consuming tasks</li>
          <li>Ensure HIPAA compliance at every step</li>
          <li>Train staff thoroughly on new systems</li>
          <li>Monitor and optimize continuously</li>
        </ul>
        
        <p><strong>Is your practice struggling with administrative overhead?</strong> Let's discuss how automation can help.</p>
      `,
      protected: false
    },
    excerpt: {
      rendered: '<p>Read how a medical practice reduced administrative work by 20 hours per week while improving patient satisfaction and reducing costs through strategic automation.</p>',
      protected: false
    },
    author: 1,
    featured_media: 3,
    comment_status: 'open',
    ping_status: 'open',
    sticky: false,
    template: '',
    format: 'standard',
    meta: [],
    categories: [4, 1],
    tags: [2, 5],
    _embedded: {
      author: [{
        id: 1,
        name: 'GrowFast Team',
        url: '',
        description: 'Business automation experts',
        link: '',
        slug: 'growfast-team',
        avatar_urls: {
          24: 'https://via.placeholder.com/24',
          48: 'https://via.placeholder.com/48',
          96: 'https://via.placeholder.com/96'
        }
      }],
      'wp:featuredmedia': [{
        id: 3,
        date: '2024-11-05T09:15:00',
        slug: 'medical-practice',
        type: 'attachment',
        link: '',
        title: { rendered: 'Medical Practice' },
        author: 1,
        caption: { rendered: '' },
        alt_text: 'Modern medical practice',
        media_type: 'image',
        mime_type: 'image/jpeg',
        media_details: {
          width: 1200,
          height: 630,
          file: '',
          sizes: {}
        },
        source_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop'
      }],
      'wp:term': [
        [
          { id: 4, link: '', name: 'Case Studies', slug: 'case-studies', taxonomy: 'category' },
          { id: 1, link: '', name: 'Automation', slug: 'automation', taxonomy: 'category' }
        ],
        [
          { id: 2, link: '', name: 'efficiency', slug: 'efficiency', taxonomy: 'post_tag' },
          { id: 5, link: '', name: 'ROI', slug: 'roi', taxonomy: 'post_tag' }
        ]
      ]
    }
  },
  {
    id: 4,
    date: '2024-11-01T11:00:00',
    date_gmt: '2024-11-01T11:00:00',
    modified: '2024-11-01T11:00:00',
    modified_gmt: '2024-11-01T11:00:00',
    slug: 'choosing-right-automation-tools',
    status: 'publish',
    type: 'post',
    link: '/blog/choosing-right-automation-tools',
    title: {
      rendered: 'The Ultimate Guide to Choosing the Right Automation Tools for Your Business'
    },
    content: {
      rendered: `
        <p>With hundreds of automation tools available, choosing the right ones for your business can be overwhelming. This guide will help you make informed decisions that align with your goals and budget.</p>
        
        <h2>Start with Your Needs Assessment</h2>
        <p>Before evaluating tools, understand what you need to automate:</p>
        <ul>
          <li>What processes consume the most time?</li>
          <li>Where do errors occur most frequently?</li>
          <li>What tasks frustrate your team the most?</li>
          <li>Which processes directly impact revenue?</li>
        </ul>
        
        <h2>Key Evaluation Criteria</h2>
        
        <h3>1. Integration Capabilities</h3>
        <p>The best automation tool is one that plays well with your existing systems. Look for tools with robust APIs and pre-built integrations with your current software stack.</p>
        
        <h3>2. Scalability</h3>
        <p>Choose tools that can grow with your business. Consider both transaction volume scaling and feature expansion.</p>
        
        <h3>3. Ease of Use</h3>
        <p>Your team needs to actually use the tool. Prioritize intuitive interfaces and good documentation. A powerful tool that nobody uses provides zero value.</p>
        
        <h3>4. Cost Structure</h3>
        <p>Look beyond the sticker price. Consider:</p>
        <ul>
          <li>Implementation costs</li>
          <li>Training requirements</li>
          <li>Ongoing maintenance</li>
          <li>Cost per transaction or user</li>
        </ul>
        
        <h3>5. Support and Community</h3>
        <p>Quality support can make or break your automation success. Look for:</p>
        <ul>
          <li>Responsive customer support</li>
          <li>Active user community</li>
          <li>Comprehensive documentation</li>
          <li>Regular updates and improvements</li>
        </ul>
        
        <h2>Popular Tool Categories</h2>
        
        <h3>Workflow Automation</h3>
        <p>Tools like Zapier, Make (Integromat), and n8n connect different apps and automate workflows between them.</p>
        
        <h3>Marketing Automation</h3>
        <p>Platforms like HubSpot, Mailchimp, and ActiveCampaign handle email sequences, lead nurturing, and campaign management.</p>
        
        <h3>Customer Relationship Management</h3>
        <p>Salesforce, Pipedrive, and Monday CRM automate sales processes, track interactions, and manage customer relationships.</p>
        
        <h3>Project Management</h3>
        <p>Asana, ClickUp, and Monday.com automate task assignments, deadlines, and team collaboration.</p>
        
        <h2>The Build vs. Buy Decision</h2>
        <p>Sometimes off-the-shelf tools don't fit your unique needs. Consider custom development when:</p>
        <ul>
          <li>Your process is highly specialized</li>
          <li>You need complete control over data</li>
          <li>Long-term ROI justifies upfront investment</li>
          <li>Available tools lack critical features</li>
        </ul>
        
        <h2>Implementation Tips</h2>
        <ol>
          <li><strong>Start Small</strong>: Pilot with one process before rolling out company-wide</li>
          <li><strong>Involve Users</strong>: Get buy-in from people who'll use the tools daily</li>
          <li><strong>Document Everything</strong>: Create guides for your specific use cases</li>
          <li><strong>Monitor and Optimize</strong>: Track metrics and refine your automations</li>
        </ol>
        
        <p><strong>Need help choosing the right tools?</strong> We offer free technology consultations to help you build the perfect automation stack.</p>
      `,
      protected: false
    },
    excerpt: {
      rendered: '<p>Navigate the complex world of automation tools with our comprehensive guide to selecting the right solutions for your business needs and budget.</p>',
      protected: false
    },
    author: 1,
    featured_media: 4,
    comment_status: 'open',
    ping_status: 'open',
    sticky: false,
    template: '',
    format: 'standard',
    meta: [],
    categories: [3, 1],
    tags: [1, 4],
    _embedded: {
      author: [{
        id: 1,
        name: 'GrowFast Team',
        url: '',
        description: 'Business automation experts',
        link: '',
        slug: 'growfast-team',
        avatar_urls: {
          24: 'https://via.placeholder.com/24',
          48: 'https://via.placeholder.com/48',
          96: 'https://via.placeholder.com/96'
        }
      }],
      'wp:featuredmedia': [{
        id: 4,
        date: '2024-11-01T11:00:00',
        slug: 'automation-tools',
        type: 'attachment',
        link: '',
        title: { rendered: 'Automation Tools' },
        author: 1,
        caption: { rendered: '' },
        alt_text: 'Various automation tools and software',
        media_type: 'image',
        mime_type: 'image/jpeg',
        media_details: {
          width: 1200,
          height: 630,
          file: '',
          sizes: {}
        },
        source_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop'
      }],
      'wp:term': [
        [
          { id: 3, link: '', name: 'Business Tips', slug: 'business-tips', taxonomy: 'category' },
          { id: 1, link: '', name: 'Automation', slug: 'automation', taxonomy: 'category' }
        ],
        [
          { id: 1, link: '', name: 'productivity', slug: 'productivity', taxonomy: 'post_tag' },
          { id: 4, link: '', name: 'workflow', slug: 'workflow', taxonomy: 'post_tag' }
        ]
      ]
    }
  },
  {
    id: 5,
    date: '2024-10-28T13:45:00',
    date_gmt: '2024-10-28T13:45:00',
    modified: '2024-10-28T13:45:00',
    modified_gmt: '2024-10-28T13:45:00',
    slug: 'roi-calculating-automation-investment',
    status: 'publish',
    type: 'post',
    link: '/blog/roi-calculating-automation-investment',
    title: {
      rendered: 'Calculating ROI: Is Automation Worth the Investment?'
    },
    content: {
      rendered: `
        <p>One of the most common questions we hear is: "How do I know if automation will actually save me money?" Let's break down how to calculate the return on investment for automation projects.</p>
        
        <h2>Understanding Automation ROI</h2>
        <p>ROI for automation isn't just about cost savings—it includes time savings, error reduction, scalability, and improved customer satisfaction. A complete ROI calculation considers all these factors.</p>
        
        <h2>The ROI Formula</h2>
        <p>Basic ROI = (Gains - Investment Cost) / Investment Cost × 100%</p>
        
        <p>For automation, this becomes:</p>
        <p>Automation ROI = (Annual Savings + Revenue Gains - Annual Costs) / Implementation Cost × 100%</p>
        
        <h2>Calculating Potential Savings</h2>
        
        <h3>Time Savings</h3>
        <p>Calculate hours saved per week × hourly labor cost × 52 weeks. For example:</p>
        <ul>
          <li>5 hours saved per week</li>
          <li>Average hourly cost: $30</li>
          <li>Annual savings: 5 × $30 × 52 = $7,800</li>
        </ul>
        
        <h3>Error Reduction</h3>
        <p>Estimate the cost of errors (rework, customer complaints, lost business) and calculate reduction percentage. If errors cost $500/month and automation reduces them by 80%:</p>
        <ul>
          <li>Monthly savings: $500 × 0.80 = $400</li>
          <li>Annual savings: $400 × 12 = $4,800</li>
        </ul>
        
        <h3>Capacity Increase</h3>
        <p>How many more clients can you serve with the same team? If automation allows you to handle 20% more clients without adding staff:</p>
        <ul>
          <li>Current revenue: $100,000</li>
          <li>Capacity increase: 20%</li>
          <li>Additional revenue: $20,000</li>
        </ul>
        
        <h2>Implementation Costs</h2>
        <p>Be realistic about upfront investments:</p>
        <ul>
          <li>Software licenses or subscriptions</li>
          <li>Implementation and customization</li>
          <li>Training and change management</li>
          <li>Ongoing maintenance and support</li>
        </ul>
        
        <h2>Real-World Example</h2>
        <p>Let's calculate ROI for a mid-sized service business:</p>
        
        <h3>Costs:</h3>
        <ul>
          <li>Implementation: $10,000</li>
          <li>Annual software: $3,000</li>
          <li>Training: $2,000</li>
          <li>Total first-year cost: $15,000</li>
        </ul>
        
        <h3>Gains:</h3>
        <ul>
          <li>Time savings: $7,800</li>
          <li>Error reduction: $4,800</li>
          <li>Additional revenue: $20,000</li>
          <li>Total annual gains: $32,600</li>
        </ul>
        
        <h3>ROI Calculation:</h3>
        <p>First year: ($32,600 - $15,000) / $15,000 = 117%</p>
        <p>Subsequent years: ($32,600 - $3,000) / $3,000 = 987%</p>
        
        <h2>Intangible Benefits</h2>
        <p>Don't forget factors that are harder to quantify but equally important:</p>
        <ul>
          <li>Employee satisfaction and retention</li>
          <li>Competitive advantage</li>
          <li>Scalability without proportional cost increase</li>
          <li>Better data and insights for decision-making</li>
          <li>Improved customer experience</li>
        </ul>
        
        <h2>When Automation Makes Sense</h2>
        <p>Automation typically delivers positive ROI when:</p>
        <ul>
          <li>Tasks are repetitive and rule-based</li>
          <li>Volume is high enough to justify investment</li>
          <li>Errors have significant costs</li>
          <li>Speed and availability matter</li>
          <li>You're planning to scale operations</li>
        </ul>
        
        <h2>Payback Period</h2>
        <p>Most businesses see positive ROI within 6-12 months for workflow automation and 3-6 months for simple process automation.</p>
        
        <p><strong>Want help calculating your automation ROI?</strong> Use our free ROI calculator or schedule a consultation to review your specific situation.</p>
      `,
      protected: false
    },
    excerpt: {
      rendered: '<p>Learn how to calculate the return on investment for automation projects and determine if automation is the right move for your business.</p>',
      protected: false
    },
    author: 1,
    featured_media: 5,
    comment_status: 'open',
    ping_status: 'open',
    sticky: false,
    template: '',
    format: 'standard',
    meta: [],
    categories: [3],
    tags: [5, 2, 1],
    _embedded: {
      author: [{
        id: 1,
        name: 'GrowFast Team',
        url: '',
        description: 'Business automation experts',
        link: '',
        slug: 'growfast-team',
        avatar_urls: {
          24: 'https://via.placeholder.com/24',
          48: 'https://via.placeholder.com/48',
          96: 'https://via.placeholder.com/96'
        }
      }],
      'wp:featuredmedia': [{
        id: 5,
        date: '2024-10-28T13:45:00',
        slug: 'roi-analysis',
        type: 'attachment',
        link: '',
        title: { rendered: 'ROI Analysis' },
        author: 1,
        caption: { rendered: '' },
        alt_text: 'Financial ROI analysis charts',
        media_type: 'image',
        mime_type: 'image/jpeg',
        media_details: {
          width: 1200,
          height: 630,
          file: '',
          sizes: {}
        },
        source_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop'
      }],
      'wp:term': [
        [
          { id: 3, link: '', name: 'Business Tips', slug: 'business-tips', taxonomy: 'category' }
        ],
        [
          { id: 5, link: '', name: 'ROI', slug: 'roi', taxonomy: 'post_tag' },
          { id: 2, link: '', name: 'efficiency', slug: 'efficiency', taxonomy: 'post_tag' },
          { id: 1, link: '', name: 'productivity', slug: 'productivity', taxonomy: 'post_tag' }
        ]
      ]
    }
  }
];

// Helper function to check if we're in demo mode
export function isDemoMode(): boolean {
  // Check if WordPress is configured
  const hasWordPressUrl = !!import.meta.env.VITE_WORDPRESS_API_URL;
  
  // Check if we're in development
  const isDev = import.meta.env.DEV;
  
  // Use demo mode if WordPress not configured or in development
  return !hasWordPressUrl || isDev;
}

// Get demo posts with filtering
export function getDemoPosts(options?: {
  page?: number;
  perPage?: number;
  categoryId?: number;
  tagId?: number;
  search?: string;
}): { posts: WordPressPost[]; total: number; totalPages: number } {
  const { page = 1, perPage = 9, categoryId, tagId, search } = options || {};
  
  let filteredPosts = [...DEMO_POSTS];
  
  // Filter by category
  if (categoryId) {
    filteredPosts = filteredPosts.filter(post => 
      post.categories.includes(categoryId)
    );
  }
  
  // Filter by tag
  if (tagId) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.includes(tagId)
    );
  }
  
  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.title.rendered.toLowerCase().includes(searchLower) ||
      post.content.rendered.toLowerCase().includes(searchLower) ||
      post.excerpt.rendered.toLowerCase().includes(searchLower)
    );
  }
  
  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  
  return {
    posts: filteredPosts.slice(start, end),
    total,
    totalPages
  };
}

// Get single demo post by slug
export function getDemoPostBySlug(slug: string): WordPressPost | null {
  return DEMO_POSTS.find(post => post.slug === slug) || null;
}

// Get featured demo post
export function getFeaturedDemoPost(): WordPressPost {
  return DEMO_POSTS.find(post => post.sticky) || DEMO_POSTS[0];
}

// Get related demo posts
export function getRelatedDemoPosts(postId: number, categories: number[], limit = 3): WordPressPost[] {
  return DEMO_POSTS
    .filter(post => 
      post.id !== postId && 
      post.categories.some(cat => categories.includes(cat))
    )
    .slice(0, limit);
}

