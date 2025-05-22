
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from "@/hooks/use-toast";
import { acChargerTypes, dcChargerTypes } from '@/utils/calculatorUtils';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Quote = () => {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      charger: '',
      location: '',
      message: ''
    }
  });

  const { toast } = useToast();

  // Combine AC and DC charger types
  const allChargerTypes = [...acChargerTypes, ...dcChargerTypes];

  const sendEmail = async (data: any) => {
    try {
      // Use a proper email service - in this case EmailJS
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: 'default_service', // Replace with your EmailJS service ID
          template_id: 'template_default', // Replace with your EmailJS template ID
          user_id: 'user_yourUserID', // Replace with your EmailJS user ID
          template_params: {
            to_email: 'sales@thunderplus.io',
            from_name: data.name,
            reply_to: data.email,
            phone: data.phone,
            charger: data.charger,
            location: data.location,
            message: data.message,
            subject: 'New Quote Request from Thunder ROI Calculator'
          }
        })
      });
      
      // Alternatively, use a server function like Formspree as a fallback
      if (!response.ok) {
        const formspreeResponse = await fetch('https://formspree.io/f/sales@thunderplus.io', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: data.name,
            phone: data.phone,
            email: data.email,
            charger: data.charger,
            location: data.location,
            message: data.message,
            subject: 'New Quote Request from Thunder ROI Calculator'
          })
        });
        
        if (!formspreeResponse.ok) {
          // Direct email fallback using mailto link
          const subject = encodeURIComponent('New Quote Request from Thunder ROI Calculator');
          const body = encodeURIComponent(`
            Name: ${data.name}
            Phone: ${data.phone}
            Email: ${data.email}
            Charger: ${data.charger}
            Location: ${data.location}
            Message: ${data.message}
          `);
          window.open(`mailto:sales@thunderplus.io?subject=${subject}&body=${body}`);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Fallback to direct email link if all else fails
      const subject = encodeURIComponent('New Quote Request from Thunder ROI Calculator');
      const body = encodeURIComponent(`
        Name: ${data.name}
        Phone: ${data.phone}
        Email: ${data.email}
        Charger: ${data.charger}
        Location: ${data.location}
        Message: ${data.message}
      `);
      window.open(`mailto:sales@thunderplus.io?subject=${subject}&body=${body}`);
      return true;
    }
  };

  const onSubmit = async (data: any) => {
    toast({
      title: "Processing your request...",
      description: "Please wait while we submit your quote request.",
    });
    
    const emailSent = await sendEmail(data);
    
    if (emailSent) {
      toast({
        title: "Quote Request Sent",
        description: "We'll contact you shortly with more information.",
      });
      reset();
    } else {
      toast({
        title: "Request Failed",
        description: "There was an error sending your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-primary transition-colors mb-6 font-montserrat">
              <ArrowLeft className="h-4 w-4" />
              Back to Calculator
            </Link>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-premium-gradient p-6 text-white">
                <h1 className="text-2xl font-poppins">Get a Quote for Your Thunder Charger</h1>
                <p className="text-gray-100 text-sm mt-1 font-montserrat">Fill in your details and we'll get back to you</p>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                      <Input
                        id="name"
                        className="border border-gray-300 bg-white text-gray-800 mt-1 w-full font-montserrat"
                        placeholder="Enter your full name"
                        {...register("name", { required: "Name is required" })}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                        <Input
                          id="phone"
                          className="border border-gray-300 bg-white text-gray-800 mt-1 w-full font-montserrat"
                          placeholder="Enter your phone number"
                          {...register("phone", { 
                            required: "Phone number is required",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Please enter a valid 10-digit phone number"
                            }
                          })}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          className="border border-gray-300 bg-white text-gray-800 mt-1 w-full font-montserrat"
                          placeholder="Enter your email address"
                          {...register("email", { 
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Please enter a valid email address"
                            }
                          })}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="charger" className="text-gray-700">Preferred Charger</Label>
                      <Select onValueChange={(value) => setValue("charger", value)}>
                        <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-800 mt-1 font-montserrat">
                          <SelectValue placeholder="Select a charger type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 text-gray-800">
                          {allChargerTypes.map((charger) => (
                            <SelectItem key={charger.id} value={charger.id} className="text-gray-800 hover:bg-gray-100 font-montserrat">
                              {charger.name} ({charger.phase} Phase - {charger.power}kW)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.charger && (
                        <p className="text-red-500 text-xs mt-1">{errors.charger.message as string}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="location" className="text-gray-700">Installation Location</Label>
                      <Input
                        id="location"
                        className="border border-gray-300 bg-white text-gray-800 mt-1 w-full font-montserrat"
                        placeholder="Enter your address or location"
                        {...register("location", { required: "Location is required" })}
                      />
                      {errors.location && (
                        <p className="text-red-500 text-xs mt-1">{errors.location.message as string}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-gray-700">Additional Information</Label>
                      <Textarea
                        id="message"
                        className="border border-gray-300 bg-white text-gray-800 mt-1 w-full min-h-[100px] font-montserrat"
                        placeholder="Any specific requirements or questions?"
                        {...register("message")}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-premium-gradient hover:opacity-90 text-white font-montserrat">
                    Submit Quote Request
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Quote;
