import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function RestaurantMap({ latitude, longitude }) {
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    const mapHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        function postToRN(type, payload) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
          }
        }
        try {
          if (typeof L === 'undefined') {
            postToRN('error', 'Leaflet no se cargó (sin internet o CDN bloqueado)');
          } else {
            const map = L.map('map').setView([${latitude}, ${longitude}], 15);
            L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
              maxZoom: 20,
              subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
              attribution: '&copy; Google Maps',
            }).addTo(map);
            L.marker([${latitude}, ${longitude}]).addTo(map);
            postToRN('ready');
          }
        } catch (e) {
          postToRN('error', e.message);
        }
      </script>
    </body>
  </html>
`;

    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'ready') {
                setLoading(false);
                setErrorMsg(null);
            } else if (data.type === 'error') {
                setLoading(false);
                setErrorMsg(data.payload || 'Error desconocido al cargar el mapa');
            }
        } catch {

        }
    };

    return (
        <View style={styles.mapContainer}>
            <WebView
                originWhitelist={['*']}
                source={{ html: mapHtml }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                style={styles.webview}
                scalesPageToFit={true}
                mixedContentMode="always"
                onMessage={handleMessage}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    setLoading(false);
                    setErrorMsg(`Error de WebView: ${nativeEvent.description || nativeEvent.code}`);
                }}
                onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    setLoading(false);
                    setErrorMsg(`Error HTTP ${nativeEvent.statusCode} al cargar el mapa`);
                }}
            />

            {loading && !errorMsg && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#C4622D" />
                    <Text style={styles.overlayText}>Cargando mapa…</Text>
                </View>
            )}

            {errorMsg && (
                <View style={styles.overlay}>
                    <Text style={styles.errorText}>No se pudo cargar el mapa</Text>
                    <Text style={styles.errorDetail}>{errorMsg}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        height: 220,
        width: '100%',
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#EFE7DD',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFE7DD',
        gap: 8,
        paddingHorizontal: 16,
    },
    overlayText: {
        fontSize: 12,
        color: '#8C6B55',
        fontWeight: '600',
    },
    errorText: {
        fontSize: 13,
        color: '#DC2626',
        fontWeight: '700',
    },
    errorDetail: {
        fontSize: 11,
        color: '#8C6B55',
        textAlign: 'center',
    },
});