"use client"
import { Button } from "@/components/ui/button";
import { OrderItem } from "@prisma/client";
import { Document, PDFDownloadLink, PDFViewer, Page, Text, View } from "@react-pdf/renderer";

import { StyleSheet } from '@react-pdf/renderer'

// // Register font
// Font.register({ family: 'Roboto', src: source });

// Reference font
const styles = StyleSheet.create({
  document: {
    fontFamily: 'Courier'
  }
})

export const Receipt = ({ order }: { order: any }) => {
  const Doc = () => (
    <Document title={`order_${order.id}`} style={styles.document}>
      <Page size="A4" style={{ margin: 10 }}>
        <View>
          <Text style={{textDecoration: "underline"}}>Metadata</Text>
          <Text>Order Id: {order.id}</Text>
          <Text>Showroom Agent: {order.employee.name}</Text>
          <Text>Customer: {order.customer.name} | {order.customer.email}</Text>
        </View>
        <View>
          <Text style={{ textDecoration: 'underline', marginTop: 10 }}>Items</Text>
          {order.items.map((item: any) =>
            <Text>{item.quantity}x | {item.price} r.s. (cgst: {item.product.cgstTaxRate}, sgst: {item.product.sgstTaxRate})</Text>
          )}
        </View>
        <View>
          <Text style={{ textDecoration: 'underline', marginTop: 10 }}>Summary</Text>
          <Text>Total Amount Owed: {order.invoice.amount}</Text>
          <Text>Amount Paid: {order.invoice.amountPaid}</Text>
        </View>
      </Page>
    </Document>
  )

  return (
    <div className="w-full flex-grow flex flex-col">
      <PDFDownloadLink document={<Doc />} fileName={`order_${order.id}.pdf`}>
        {({ blob, url, loading, error }) =>
          <div className="w-full flex items-center justify-center">
            <Button disabled={loading} className="my-4">
              Download Reciept {"->"}
            </Button>
          </div>
        }
      </PDFDownloadLink>
      <PDFViewer className="w-full flex-grow" >
        <Doc />
      </PDFViewer>
    </div>
  )
};