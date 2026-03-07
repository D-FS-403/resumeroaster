import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { generateRoastEmail } from '@/lib/emailTemplates';

// Initialize Resend
// Initialize Resend - handle missing key to avoid constructor crash
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, roastId } = body;

        if (!email || !roastId) {
            return NextResponse.json(
                { error: 'Email and roastId are required' },
                { status: 400 }
            );
        }

        if (!process.env.RESEND_API_KEY) {
            console.warn("Resend API Key not found. Email will not be sent.");
            return NextResponse.json({ success: false, message: "Missing Resend API Key" }, { status: 500 });
        }

        // Fetch the roast from Supabase
        const { data: roastData, error: dbError } = await supabase
            .from('roasts')
            .select('*')
            .eq('id', roastId)
            .single();

        if (dbError || !roastData) {
            console.error('Failed to fetch roast for email:', dbError);
            return NextResponse.json(
                { error: 'Roast not found' },
                { status: 404 }
            );
        }

        // Transform back to camelCase for the template
        const formattedRoast = {
            overallScore: roastData.overall_score,
            grade: roastData.grade,
            roastHeadline: roastData.roast_headline,
            badges: roastData.badges,
            categories: roastData.categories
        };

        // Generate HTML
        const htmlContent = generateRoastEmail(formattedRoast as any, roastId);

        // Send through Resend
        const { data, error: resendError } = await resend.emails.send({
            from: 'ResumeRoast <roast@resumeroaster.xyz>',
            to: [email],
            subject: `Your Resume Scored ${roastData.overall_score}/100 — Here's Your Roast 🔥`,
            html: htmlContent,
        });

        if (resendError) {
            console.error('Resend API error:', resendError);
            return NextResponse.json(
                { error: 'Failed to send email report' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, id: data?.id });
    } catch (error) {
        console.error('Send Report API error:', error);
        return NextResponse.json(
            { error: 'Internal server error while sending email' },
            { status: 500 }
        );
    }
}
