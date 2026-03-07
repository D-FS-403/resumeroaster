import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';
export const alt = 'ResumeRoast Results';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
    const { data: roast } = await supabase
        .from('roasts')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!roast) {
        return new ImageResponse(
            (
                <div
                    style={{
                        background: '#0D0D0D',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FF3B30',
                        fontSize: 48,
                    }}
                >
                    Roast not found
                </div>
            ),
            { ...size }
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0D0D0D',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    color: '#F5F0E8',
                    fontFamily: '"Playfair Display"',
                    padding: '60px',
                }}
            >
                {/* Left Third: Score */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '35%',
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                        paddingRight: '40px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '180px',
                            color: '#FF3B30',
                            fontWeight: 900,
                            lineHeight: 1,
                            marginBottom: '20px',
                        }}
                    >
                        {roast.overall_score}
                    </div>
                    <div
                        style={{
                            fontSize: '48px',
                            fontStyle: 'italic',
                            fontWeight: 'bold',
                            color: '#FF3B30',
                        }}
                    >
                        GRADE {roast.grade}
                    </div>
                </div>

                {/* Right Two-Thirds: Headline & Categories */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '65%',
                        paddingLeft: '60px',
                        justifyContent: 'space-between',
                    }}
                >
                    <div
                        style={{
                            fontSize: '64px',
                            fontWeight: 'bold',
                            lineHeight: 1.1,
                            marginTop: '40px',
                        }}
                    >
                        {roast.roast_headline}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            marginBottom: '40px',
                        }}
                    >
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {(roast.categories || []).slice(0, 3).map((cat: any) => (
                                <div
                                    key={cat.name}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '50px',
                                        fontSize: '24px',
                                        fontFamily: 'system-ui',
                                        display: 'flex',
                                    }}
                                >
                                    <span style={{ color: 'rgba(255,255,255,0.6)', marginRight: '8px' }}>
                                        {cat.name}
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>{cat.score}%</span>
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginTop: '60px',
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#FF3B30',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                }}
                            >
                                R
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', opacity: 0.8 }}>
                                resumeroaster.xyz
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
