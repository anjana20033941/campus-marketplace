import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Listing } from "../../../types";
import { sendRentBorrowRequest } from "../services/rentBorrowService";
import { RentBorrowType } from "../types";

export function RentBorrowModal({
  visible,
  item,
  currentUserId,
  currentUserName,
  currentUserEmail,
  onClose,
  onSuccess,
}: {
  visible: boolean;
  item: Listing | null;
  currentUserId: string | null;
  currentUserName?: string;
  currentUserEmail?: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [requestType, setRequestType] = useState<RentBorrowType>("borrow");
  const [duration, setDuration] = useState("3 Days");
  const [offeredPrice, setOfferedPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!item) return null;

  const handleSubmit = async () => {
    if (!currentUserId) {
      setError("Please sign in first to send a rent or borrow request.");
      return;
    }
    if (!duration.trim()) {
      setError("Please enter the duration (e.g. 3 days, 1 week).");
      return;
    }
    if (!message.trim()) {
      setError("Please write a short message explaining why you need this item.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendRentBorrowRequest({
        listing: item,
        requesterId: currentUserId,
        requesterName: currentUserName || "Campus Student",
        requesterEmail: currentUserEmail,
        type: requestType,
        duration: duration.trim(),
        offeredPrice: offeredPrice ? parseFloat(offeredPrice) : undefined,
        message: message.trim(),
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError("");
    setMessage("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleResetAndClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <Pressable style={styles.closeBtn} onPress={handleResetAndClose}>
            <Text style={styles.closeBtnText}>×</Text>
          </Pressable>

          {submitted ? (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.title}>Request Sent!</Text>
              <Text style={styles.subtitle}>
                Your {requestType} request for "{item.title}" was successfully sent to {item.seller}.
              </Text>
              <Text style={styles.infoText}>
                Once the seller approves, this listing will be marked as rented/borrowed.
              </Text>
              <Pressable style={styles.primaryButton} onPress={handleResetAndClose}>
                <Text style={styles.primaryButtonText}>Done</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              <Text style={styles.eyebrow}>CAMPUS SHARING</Text>
              <Text style={styles.title}>Rent or Borrow Item</Text>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.sellerSubtitle}>Seller: {item.seller}</Text>

              {/* Type Switcher */}
              <View style={styles.typeSelector}>
                <Pressable
                  style={[styles.typeButton, requestType === "borrow" && styles.typeButtonActive]}
                  onPress={() => setRequestType("borrow")}
                >
                  <Text
                    style={[styles.typeButtonText, requestType === "borrow" && styles.typeButtonTextActive]}
                  >
                    Borrow (ණයට)
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.typeButton, requestType === "rent" && styles.typeButtonActive]}
                  onPress={() => setRequestType("rent")}
                >
                  <Text
                    style={[styles.typeButtonText, requestType === "rent" && styles.typeButtonTextActive]}
                  >
                    Rent (කුලියට)
                  </Text>
                </Pressable>
              </View>

              {/* Duration input */}
              <Text style={styles.label}>Duration / Needed Time</Text>
              <TextInput
                value={duration}
                onChangeText={setDuration}
                placeholder="e.g. 2 Days, 1 Week, 1 Month"
                placeholderTextColor="#87918C"
                style={styles.input}
              />

              {/* Offered Price if Renting */}
              {requestType === "rent" && (
                <>
                  <Text style={styles.label}>Offered Rent Amount ($) (Optional)</Text>
                  <TextInput
                    value={offeredPrice}
                    onChangeText={setOfferedPrice}
                    placeholder="e.g. 10"
                    placeholderTextColor="#87918C"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </>
              )}

              {/* Message to Seller */}
              <Text style={styles.label}>Message to {item.seller}</Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Explain why you need this and when you can return it..."
                placeholderTextColor="#87918C"
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Pressable
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    Send {requestType === "rent" ? "Rent" : "Borrow"} Request
                  </Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F4F2",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeBtnText: {
    fontSize: 20,
    color: "#2C3E35",
    fontWeight: "700",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1C7057",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1B3A33",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#284D43",
  },
  sellerSubtitle: {
    fontSize: 13,
    color: "#7D8C85",
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: "row",
    backgroundColor: "#EEF3F0",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#67756F",
  },
  typeButtonTextActive: {
    color: "#1C7057",
    fontWeight: "700",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#233F37",
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#F6F8F7",
    borderWidth: 1,
    borderColor: "#DEE5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1B3A33",
    marginBottom: 12,
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#C33D3D",
    fontSize: 12,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: "#1C7057",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successIcon: {
    fontSize: 48,
    color: "#1C7057",
    marginBottom: 12,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 15,
    color: "#2E4F45",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  infoText: {
    fontSize: 13,
    color: "#77857F",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 18,
  },
});
