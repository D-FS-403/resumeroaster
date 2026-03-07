import { RoastResult } from '@/types';

export function generateRoastEmail(roast: RoastResult, roastId: string): string {
    const scoreColor = roast.overallScore >= 75 ? '#34C759' : roast.overallScore >= 50 ? '#FF9500' : '#FF3B30';
    const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://resumeroaster.xyz'}/roast/${roastId}`;

    // Mapping categories into rows
    const categoryRows = roast.categories.map(cat => {
        const catColor = cat.score >= 75 ? '#34C759' : cat.score >= 50 ? '#FF9500' : '#FF3B30';
        return `
      <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-family: monospace; font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 2px;">${cat.name}</span>
          <span style="font-family: monospace; font-size: 16px; font-weight: bold; color: ${catColor};">${cat.score}%</span>
        </div>
        <p style="font-family: Helvetica, Arial, sans-serif; font-size: 16px; color: rgba(255,255,255,0.9); font-style: italic; line-height: 1.5; margin: 0 0 12px 0;">
          "${cat.roastLine}"
        </p>
        <div style="background-color: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px;">
           <p style="font-family: monospace; font-size: 12px; color: rgba(255,255,255,0.5); font-style: italic; margin: 0;">💡 ${cat.tip}</p>
        </div>
      </div>
    `;
    }).join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Resume Roast Report</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #050505; color: #F5F0E8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      
      <!-- Main Container -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050505; margin: 0; padding: 40px 20px;">
        <tr>
          <td align="center">
            
            <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #0D0D0D; max-width: 600px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 40px 40px 20px 40px;">
                  <div style="background-color: #FF3B30; width: 40px; height: 40px; border-radius: 8px; line-height: 40px; text-align: center; color: white; font-weight: bold; font-size: 20px; font-family: monospace; margin: 0 auto 20px auto;">
                    R
                  </div>
                  <h1 style="margin: 0; font-size: 24px; font-weight: bold; padding-bottom: 20px;">Resumé<span style="color: #FF3B30;">Roast</span></h1>
                </td>
              </tr>
              
              <!-- Hero Score -->
              <tr>
                <td align="center" style="padding: 0 40px 40px 40px;">
                  <p style="font-family: monospace; font-size: 12px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 4px; margin-bottom: 20px;">Your Official Verdict</p>
                  
                  <div style="margin-bottom: 10px;">
                    <span style="font-size: 120px; font-weight: 900; line-height: 1; color: ${scoreColor}; letter-spacing: -4px;">${roast.overallScore}</span>
                  </div>
                  <div style="font-size: 24px; font-style: italic; font-weight: bold; color: ${scoreColor}; margin-bottom: 40px; text-transform: uppercase;">
                    GRADE ${roast.grade}
                  </div>
                  
                  <h2 style="font-size: 32px; font-weight: bold; margin: 0; line-height: 1.2; font-style: italic;">
                    "${roast.roastHeadline}"
                  </h2>
                </td>
              </tr>
              
              <!-- Divider -->
              <tr>
                <td style="padding: 0 40px;">
                  <div style="height: 1px; background-color: rgba(255,255,255,0.1); width: 100%;"></div>
                </td>
              </tr>
              
              <!-- Categories -->
              <tr>
                <td style="padding: 40px;">
                  <h3 style="margin: 0 0 30px 0; font-size: 14px; font-family: monospace; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px;">The Breakdown</h3>
                  
                  ${categoryRows}
                  
                </td>
              </tr>
              
              <!-- CTA Action -->
              <tr>
                <td align="center" style="padding: 0 40px 60px 40px;">
                  <a href="${reportUrl}" style="display: inline-block; background-color: #FF3B30; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-family: monospace; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 14px;">
                    View Full Interactive Report
                  </a>
                </td>
              </tr>
              
              <!-- Footer Upgrade -->
              <tr>
                <td align="center" style="padding: 30px 40px; background-color: rgba(255,59,48,0.05); border-top: 1px solid rgba(255,59,48,0.1);">
                  <strong style="display: block; color: #ffffff; font-size: 18px; margin-bottom: 10px;">Want to actually fix it?</strong>
                  <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
                    Upgrade to Pro to use the AI "Fix It" bullet rewriter, Job Match mode, and PDF exports.
                  </p>
                  <a href="${reportUrl}" style="color: #FF3B30; text-decoration: none; font-weight: bold;">Upgrade to Pro →</a>
                </td>
              </tr>
              
            </table>
            
            <p style="margin-top: 40px; font-family: monospace; font-size: 10px; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 2px;">
              © 2024 ResuméRoast. Sent with 🔥
            </p>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
