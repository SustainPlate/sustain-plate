
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, MapPin, Calendar, Clock, User, Info, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';

const DeliveryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [delivery, setDelivery] = useState<any>(null);
  const [donation, setDonation] = useState<any>(null);
  const [donor, setDonor] = useState<any>(null);
  const [ngo, setNgo] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch delivery with related donation
        const { data: deliveryData, error: deliveryError } = await supabase
          .from('deliveries')
          .select('*')
          .eq('id', id)
          .single();
          
        if (deliveryError) throw deliveryError;
        if (!deliveryData) throw new Error('Delivery not found');
        
        setDelivery(deliveryData);
        
        // Fetch donation details
        const { data: donationData, error: donationError } = await supabase
          .from('donations')
          .select('*')
          .eq('id', deliveryData.donation_id)
          .single();
          
        if (donationError) throw donationError;
        setDonation(donationData);
        
        // Fetch donor profile
        const { data: donorData, error: donorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', donationData.donor_id)
          .single();
          
        if (donorError) throw donorError;
        setDonor(donorData);
        
        // Fetch NGO profile if assigned
        if (donationData.assigned_ngo_id) {
          const { data: ngoData, error: ngoError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', donationData.assigned_ngo_id)
            .single();
            
          if (!ngoError && ngoData) {
            setNgo(ngoData);
          }
        }
        
      } catch (error: any) {
        console.error('Error fetching delivery details:', error);
        toast({
          title: "Error",
          description: "Failed to load delivery details: " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeliveryDetails();
  }, [id, toast]);
  
  const handleStatusUpdate = async (newStatus: string) => {
    if (!delivery || !user) return;
    
    try {
      setUpdating(true);
      
      const updates: any = { status: newStatus };
      
      // Add timestamps based on status
      if (newStatus === 'in_progress') {
        updates.pickup_time = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updates.delivery_time = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('deliveries')
        .update(updates)
        .eq('id', delivery.id);
        
      if (error) throw error;
      
      // If status changed to in_progress or completed, create a notification for the donor
      if ((newStatus === 'in_progress' || newStatus === 'completed') && donation) {
        const notificationTitle = newStatus === 'in_progress' 
          ? 'Donation Pickup Started' 
          : 'Donation Successfully Delivered';
          
        const notificationMessage = newStatus === 'in_progress'
          ? `A volunteer has picked up your donation "${donation.food_name}"`
          : `Your donation "${donation.food_name}" has been successfully delivered`;
        
        // Call the create_notification function
        const { data, error: notifyError } = await supabase.rpc(
          'create_notification',
          { 
            user_id: donation.donor_id,
            title: notificationTitle,
            message: notificationMessage,
            related_to: 'donation',
            related_id: donation.id
          }
        );
        
        if (notifyError) {
          console.error('Error creating notification:', notifyError);
        }
      }
      
      // Update local state
      setDelivery({ ...delivery, ...updates });
      
      toast({
        title: "Status Updated",
        description: `Delivery status has been updated to ${newStatus}.`,
      });
      
    } catch (error: any) {
      console.error('Error updating delivery status:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update delivery status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };
  
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'PPP p');
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending Assignment</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-500">Assigned</Badge>;
      case 'in_progress':
        return <Badge className="bg-indigo-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading delivery details...</p>
        </div>
      </div>
    );
  }
  
  if (!delivery || !donation) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Delivery Not Found</h1>
          <p className="mb-4">We couldn't find the delivery information you're looking for.</p>
          <Button onClick={() => navigate('/dashboard')} variant="default">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Delivery Assignment</CardTitle>
                  <CardDescription>
                    Delivery ID: {delivery.id}
                  </CardDescription>
                </div>
                <div>
                  {getStatusBadge(delivery.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Donation</h3>
                  <p className="text-lg font-semibold">{donation.food_name}</p>
                  <p className="text-sm text-gray-600">
                    {donation.quantity} {donation.unit}
                  </p>
                  {donation.description && (
                    <p className="text-sm text-gray-600 mt-1">{donation.description}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Expiry Date</h3>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {formatDate(donation.expiry_date)}
                  </p>
                  
                  {delivery.pickup_time && (
                    <div className="mt-2">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Pickup Time</h3>
                      <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDateTime(delivery.pickup_time)}
                      </p>
                    </div>
                  )}
                  
                  {delivery.delivery_time && (
                    <div className="mt-2">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Delivery Time</h3>
                      <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDateTime(delivery.delivery_time)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Pickup Address</h3>
                  <p className="flex items-start">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 text-gray-400" />
                    <span>{donation.pickup_address}</span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Donor</h3>
                  <p className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-400" />
                    {donor?.full_name || 'Unknown'}
                  </p>
                </div>
              </div>
              
              {(donation.temperature_requirements || donation.dietary_info) && (
                <div className="bg-blue-50 p-3 rounded-md mb-4">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                    <div>
                      {donation.temperature_requirements && (
                        <p className="text-sm">
                          <span className="font-medium">Temperature:</span> {donation.temperature_requirements}
                        </p>
                      )}
                      {donation.dietary_info && (
                        <p className="text-sm">
                          <span className="font-medium">Dietary Info:</span> {donation.dietary_info}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {delivery.notes && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Delivery Notes</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded">{delivery.notes}</p>
                </div>
              )}
            </CardContent>
            
            {profile?.user_type.includes('volunteer') && delivery.status !== 'completed' && delivery.status !== 'cancelled' && (
              <CardFooter className="pt-4 flex-col items-stretch">
                <Separator className="mb-4" />
                
                {delivery.status === 'pending' && (
                  <Button 
                    onClick={() => handleStatusUpdate('assigned')}
                    disabled={updating}
                    className="w-full"
                  >
                    {updating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Accept Delivery Assignment
                  </Button>
                )}
                
                {delivery.status === 'assigned' && (
                  <Button 
                    onClick={() => handleStatusUpdate('in_progress')}
                    disabled={updating}
                    className="w-full"
                  >
                    {updating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    ) : (
                      <Clock className="mr-2 h-4 w-4" />
                    )}
                    Start Pickup
                  </Button>
                )}
                
                {delivery.status === 'in_progress' && (
                  <Button 
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={updating}
                    className="w-full"
                  >
                    {updating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Complete Delivery
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
