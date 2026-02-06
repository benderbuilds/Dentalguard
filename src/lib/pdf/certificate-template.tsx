import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  border: {
    border: '3pt solid #1e40af',
    borderRadius: 4,
    padding: 40,
    height: '100%',
  },
  innerBorder: {
    border: '1pt solid #93c5fd',
    borderRadius: 2,
    padding: 30,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  brandName: {
    fontSize: 14,
    color: '#1e40af',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  practiceName: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: '#1e40af',
    marginVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  presentedTo: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  employeeName: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 1.6,
    maxWidth: 400,
    marginBottom: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 24,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 9,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 'auto',
    paddingTop: 20,
  },
  signatureBlock: {
    alignItems: 'center',
    width: 180,
  },
  signatureLine: {
    width: '100%',
    borderBottom: '1pt solid #d1d5db',
    marginBottom: 6,
    paddingBottom: 4,
  },
  signatureText: {
    fontSize: 10,
    color: '#374151',
    fontFamily: 'Helvetica-Oblique',
  },
  signatureLabel: {
    fontSize: 8,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    width: '100%',
  },
  complianceNote: {
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 4,
  },
  certificateId: {
    fontSize: 7,
    color: '#d1d5db',
    textAlign: 'center',
  },
})

export interface CertificateData {
  certificateId: string
  employeeName: string
  trainingTitle: string
  trainingType: string
  practiceName: string
  completionDate: string
  score: number
  passingScore: number
  signatureName: string
  signatureTimestamp: string
}

export function CertificateDocument({ data }: { data: CertificateData }) {
  const complianceNotes: Record<string, string> = {
    osha: 'This training satisfies the annual requirement per 29 CFR 1910.1030 (Bloodborne Pathogens Standard)',
    hipaa: 'This training satisfies the HIPAA Privacy and Security Rule training requirement (45 CFR 164.530(b))',
    hazcom: 'This training satisfies the Hazard Communication Standard requirement per 29 CFR 1910.1200',
    emergency: 'This training satisfies the Emergency Action Plan requirement per 29 CFR 1910.38',
    state: 'This training satisfies applicable state regulatory training requirements',
  }

  const complianceNote = complianceNotes[data.trainingType] || complianceNotes.osha

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.innerBorder}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.brandName}>DentalPilot</Text>
              <Text style={styles.practiceName}>{data.practiceName}</Text>
            </View>

            <View style={styles.divider} />

            {/* Title */}
            <Text style={styles.title}>Certificate of Completion</Text>
            <Text style={styles.subtitle}>Compliance Training</Text>

            {/* Presented To */}
            <Text style={styles.presentedTo}>Presented To</Text>
            <Text style={styles.employeeName}>{data.employeeName}</Text>

            {/* Description */}
            <Text style={styles.description}>
              Has successfully completed the {data.trainingTitle} training module
              with a score of {data.score}% (passing score: {data.passingScore}%).
            </Text>

            {/* Details */}
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Training</Text>
                <Text style={styles.detailValue}>{data.trainingTitle}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>
                  {data.trainingType.toUpperCase()}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{data.completionDate}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Score</Text>
                <Text style={styles.detailValue}>{data.score}%</Text>
              </View>
            </View>

            {/* Signatures */}
            <View style={styles.signatureSection}>
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine}>
                  <Text style={styles.signatureText}>
                    {data.signatureName}
                  </Text>
                </View>
                <Text style={styles.signatureLabel}>Employee Signature</Text>
              </View>
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine}>
                  <Text style={styles.signatureText}>
                    {data.signatureTimestamp}
                  </Text>
                </View>
                <Text style={styles.signatureLabel}>Date & Time Signed</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.complianceNote}>{complianceNote}</Text>
              <Text style={styles.certificateId}>
                Certificate ID: {data.certificateId}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
