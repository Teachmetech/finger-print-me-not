import { FingerPrintMeNotClient } from '../src/index.js';

const UPWORK_QUERY = `query($limit: Int, $toTime: String) {
    mostRecentJobsFeed(limit: $limit, toTime: $toTime) {
        results {
            id,
            uid:id
            title,
            ciphertext,
            description,
            type,
            recno,
            freelancersToHire,
            duration,
            engagement,
            amount {
                amount,
            },
            createdOn:createdDateTime,
            publishedOn:publishedDateTime,
            prefFreelancerLocationMandatory,
            connectPrice,
            client {
                totalHires
                totalSpent
                paymentVerificationStatus,
                location {
                    country,
                },
                totalReviews
                totalFeedback,
                hasFinancialPrivacy
            },
            tierText
            tier
            tierLabel
            proposalsTier
            enterpriseJob
            premium,
            jobTs:jobTime,
            attrs:skills {
                id,
                uid:id,
                prettyName:prefLabel
                prefLabel
            }
            hourlyBudget {
                type
                min
                max
            }
            isApplied
        },
        paging {
            total,
            count,
            resultSetTs:minTime,
            maxTime
        }
    }
}`;

async function main() {
    try {
        // Create a session with Chrome fingerprint
        const session = new FingerPrintMeNotClient.Session({
            clientIdentifier: 'chrome_120'
        });

        // Set headers
        const headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": "application/json",
            "Authorization": "bearer <token>"
        };

        // Make the GraphQL request
        const response = await session.post(
            "https://www.upwork.com/api/graphql/v1?alias=mostRecentJobsFeed",
            {
                headers,
                json: {
                    query: UPWORK_QUERY,
                    variables: {
                        limit: 10
                    }
                }
            }
        );

        console.log('Status Code:', response.status);
        if (response.json) {
            console.log('Recent Jobs:', JSON.stringify(response.json, null, 2));
        }
    } catch (error) {
        if (error instanceof FingerPrintMeNotClient.FingerPrintMeNotException) {
            console.error('FingerPrintMeNot Error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

main().catch(console.error); 