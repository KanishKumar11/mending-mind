import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 30,
  },
  coverPage: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 30,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  contentPage: {
    flexDirection: "column",
    backgroundColor: "#fafafa", // Lighter background
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  centerLogo: {
    width: 120,
    height: 40,
    marginBottom: 10,
    alignSelf: "center",
  },
  brainImage: {
    width: 400,
    height: 360,
    marginTop: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "Montserrat",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 10,
    fontFamily: "Montserrat",
  },
  broughtBy: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
    fontFamily: "Montserrat",
  },
  disclaimer: {
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 5,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    fontFamily: "Montserrat",
  },
  testAdmin: {
    fontSize: 16,
    fontWeight: 300,
    textAlign: "center",
    marginTop: 60,
    marginBottom: 10,
    fontFamily: "Montserrat",
  },
  formContainer: {
    flexDirection: "column",
    marginTop: 10,
    alignSelf: "center",
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  formLabel: {
    width: 50,
    fontSize: 14,
    fontFamily: "Montserrat",
    fontWeight: 300,
  },
  formInput: {
    width: 200,
    height: 24,
    borderColor: "#F0C93B",
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 12,
    fontFamily: "Montserrat",
  },
  formValue: {
    fontSize: 12,
    fontFamily: "Montserrat",
    paddingLeft: 5,
  },
  headerLogo: {
    width: 60,
    height: 24,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Montserrat",
  },
  yellowLine: {
    borderBottomColor: "#F0C93B",
    borderBottomWidth: 1,
    marginBottom: 15,
    marginTop: 5,
  },
  tealLine: {
    borderBottomColor: "#B4E0E0",
    borderBottomWidth: 1,
    marginBottom: 15,
    marginTop: 5,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoColumn: {
    flexDirection: "column",
    width: "50%",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Montserrat",
    marginLeft: 5,
  },
  paragraph: {
    fontSize: 12,
    textAlign: "justify",
    marginBottom: 10,
    lineHeight: 1.5,
    fontFamily: "Montserrat",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
    fontFamily: "Montserrat",
  },
  chartPlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#f0f0f0",
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  chartText: {
    color: "#969696",
    fontSize: 14,
    fontFamily: "Montserrat",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Montserrat",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
  footerText: {
    textAlign: "center",
    fontSize: 10,
    marginBottom: 5,
    fontFamily: "Montserrat",
    fontStyle: "italic",
  },
  // New styles for the updated layout
  disclaimerText: {
    fontSize: 10,
    fontFamily: "Montserrat",
    textAlign: "center",
    fontStyle: "italic",
  },
  mainTitleContainer: {
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    textAlign: "center",
  },
  mainSubtitle: {
    fontSize: 14,
    fontFamily: "Montserrat",
    textAlign: "center",
    fontWeight: 300,
    visibility: "invisible",
  },
  contactInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  contactText: {
    fontSize: 12,
    fontFamily: "Montserrat",
  },
  horizontalLine: {
    borderBottomColor: "#F0C93B",
    borderBottomWidth: 1,
    marginVertical: 6,
  },
  yellowLine: {
    borderBottomColor: "#F0C93B",
    borderBottomWidth: 2,
    marginVertical: 10,
  },
  addressContainer: {
    marginVertical: 5,
  },
  addressText: {
    fontSize: 12,
    fontFamily: "Montserrat",
  },
  evaluationTitleContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  evaluationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  userInfoBox: {
    backgroundColor: "#FFF8E1", // Lighter background
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 0,
    borderTopWidth: 3,
    borderTopColor: "#F0C93B", // Yellow top border
  },
  userInfoLeft: {
    width: "50%",
  },
  userInfoRight: {
    width: "50%",
    alignItems: "flex-end",
  },
  userInfoItem: {
    marginBottom: 10,
    flexDirection: "row",
  },
  userInfoLabel: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  userInfoValue: {
    fontSize: 12,
    fontFamily: "Montserrat",
    marginLeft: 5,
  },
  resultsIntroContainer: {
    marginVertical: 2,
  },
  resultsIntroText: {
    fontSize: 12,
    fontFamily: "Montserrat",
  },
  aboutTestContainer: {
    marginTop: 10,
  },
  aboutTestTitle: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    marginBottom: 5,
  },
  aboutTestText: {
    fontSize: 11,
    fontFamily: "Montserrat",
    textAlign: "justify",
  },
  noteBox: {
    backgroundColor: "#FFF8E1", // Lighter background
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    borderTopWidth: 3,
    borderTopColor: "#F0C93B", // Yellow top border
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    marginBottom: 5,
  },
  noteText: {
    fontSize: 11,
    fontFamily: "Montserrat",
    textAlign: "justify",
    fontWeight: 300,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "start",
  },
  centerLogoContainer: {
    alignItems: "center",
    width: "60%",
    alignSelf: "center",
  },
  barcodeContainer: {
    width: 120,
    alignItems: "center",
    height: 40,
    justifyContent: "center",
  },
  barcodeImage: {
    width: 100,
    height: 40,
  },
  barcodeText: {
    fontFamily: "Montserrat",
    fontSize: 8,
    textAlign: "center",
    marginBottom: 5,
  },
  testSectionContainer: {
    // marginVertical: 8,
    borderRadius: 8,
    padding: 10,
    // Removed left border as requested
    backgroundColor: "#FAFAFA",
  },
  testSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    marginBottom: 10,
    color: "#000000",
    backgroundColor: "#F0C93B", // Gold background
    padding: 8,
    textAlign: "center",
    borderRadius: 4,
  },
  testResultsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  chartContainer: {
    width: "30%",
    marginRight: 10,
  },
  chartImage: {
    width: 250,
    height: 250,
    objectFit: "contain",
    alignSelf: "center",
  },
  fullWidthChartContainer: {
    width: "100%",
    // marginBottom: 15,
    alignItems: "center",
  },
  fullWidthChartImage: {
    width: 500,
    height: 237,
    objectFit: "contain",
    alignSelf: "center",
  },
  personalityDescriptionContainer: {
    width: "100%",
    // marginTop: 10,
  },
  pieChartPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0C93B",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  pieChartText: {
    fontSize: 10,
    fontFamily: "Montserrat",
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
  },
  resultsTextContainer: {
    width: "70%",
  },
  resultsText: {
    fontSize: 12,
    fontFamily: "Montserrat",
    marginBottom: 18,
  },
  bulletPointContainer: {
    marginTop: 5,
  },
  bulletPoint: {
    fontSize: 11,
    fontFamily: "Montserrat",
    marginBottom: 3,
  },
  resultsDescription: {
    fontSize: 11,
    fontFamily: "Montserrat",
    textAlign: "justify",
    marginTop: 5,
  },
});
